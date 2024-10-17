import { createRequire as topLevelCreateRequire } from 'module';const require = topLevelCreateRequire(import.meta.url);

// support/nodejs-runtime/index.ts
import { workerData } from "node:worker_threads";
import path from "path";
import fs from "fs";
import http from "http";
import url from "url";
var input = workerData;
var parsed = path.parse(input.handler);
var file = [".js", ".jsx", ".mjs", ".cjs"].map((ext) => path.join(input.out, parsed.dir, parsed.name + ext)).find((file2) => {
  return fs.existsSync(file2);
});
var fn;
function fetch(req) {
  return new Promise((resolve, reject) => {
    const request2 = http.request(
      input.url + req.path,
      {
        headers: req.headers,
        method: req.method
      },
      (res) => {
        let body = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => {
          body += chunk.toString();
        });
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body
          });
        });
      }
    );
    request2.on("error", reject);
    if (req.body)
      request2.write(req.body);
    request2.end();
  });
}
try {
  const { href } = url.pathToFileURL(file);
  const mod = await import(href);
  const handler = parsed.ext.substring(1);
  fn = mod[handler];
  if (!fn) {
    throw new Error(
      `Function "${handler}" not found in "${input.handler}". Found ${Object.keys(mod).join(", ")}`
    );
  }
} catch (ex) {
  await fetch({
    path: `/runtime/init/error`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      errorType: "Error",
      errorMessage: ex.message,
      trace: ex.stack?.split("\n")
    })
  });
  process.exit(1);
}
var timeout;
var request;
var response;
var context;
async function error(ex) {
  await fetch({
    path: `/runtime/invocation/${context.awsRequestId}/error`,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      errorType: "Error",
      errorMessage: ex.message,
      trace: ex.stack?.split("\n")
    })
  });
}
process.on("unhandledRejection", error);
while (true) {
  if (timeout)
    clearTimeout(timeout);
  timeout = setTimeout(() => {
    process.exit(0);
  }, 1e3 * 60 * 15);
  try {
    const result = await fetch({
      path: `/runtime/invocation/next`,
      method: "GET",
      headers: {}
    });
    context = {
      awsRequestId: result.headers["lambda-runtime-aws-request-id"],
      invokedFunctionArn: result.headers["lambda-runtime-invoked-function-arn"],
      getRemainingTimeInMillis: () => Math.max(
        Number(result.headers["lambda-runtime-deadline-ms"]) - Date.now(),
        0
      ),
      // If identity is null, we want to mimick AWS behavior and return undefined
      identity: JSON.parse(result.headers["lambda-runtime-cognito-identity"]) ?? void 0,
      // If clientContext is null, we want to mimick AWS behavior and return undefined
      clientContext: JSON.parse(result.headers["lambda-runtime-client-context"]) ?? void 0,
      functionName: process.env.AWS_LAMBDA_FUNCTION_NAME,
      functionVersion: process.env.AWS_LAMBDA_FUNCTION_VERSION,
      memoryLimitInMB: process.env.AWS_LAMBDA_FUNCTION_MEMORY_SIZE,
      logGroupName: result.headers["lambda-runtime-log-group-name"],
      logStreamName: result.headers["lambda-runtime-log-stream-name"],
      callbackWaitsForEmptyEventLoop: {
        set value(_value) {
          throw new Error(
            "`callbackWaitsForEmptyEventLoop` on lambda Context is not implemented by SST Live Lambda Development."
          );
        },
        get value() {
          return true;
        }
      }.value,
      done() {
        throw new Error(
          "`done` on lambda Context is not implemented by SST Live Lambda Development."
        );
      },
      fail() {
        throw new Error(
          "`fail` on lambda Context is not implemented by SST Live Lambda Development."
        );
      },
      succeed() {
        throw new Error(
          "`succeed` on lambda Context is not implemented by SST Live Lambda Development."
        );
      }
    };
    request = JSON.parse(result.body);
  } catch {
    continue;
  }
  global[Symbol.for("aws.lambda.runtime.requestId")] = context.awsRequestId;
  try {
    response = await fn(request, context);
  } catch (ex) {
    error(ex);
    continue;
  }
  while (true) {
    try {
      await fetch({
        path: `/runtime/invocation/${context.awsRequestId}/response`,
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(response)
      });
      break;
    } catch (ex) {
      console.error(ex);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}
