import https from "https";
export function postPayload(endpoint, body) {
    return new Promise((resolve, reject) => {
        try {
            const req = https
                .request(endpoint, {
                method: "POST",
                headers: { "content-type": "application/json" },
                timeout: 5000,
            }, (resp) => {
                if (resp.statusCode !== 200) {
                    reject(new Error(`Unexpected status code: ${resp.statusCode}`));
                    return;
                }
                resolve();
            })
                .on("error", () => {
                // catches connect ECONNREFUSED while the below catch does not work as expected
            });
            req.write(JSON.stringify(body));
            req.end();
        }
        catch (ex) {
            reject(ex);
        }
    });
}
