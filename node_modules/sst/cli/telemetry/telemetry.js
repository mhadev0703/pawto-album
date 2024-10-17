import Conf from "conf";
import { createHash, randomBytes } from "crypto";
import { postPayload } from "./post-payload.js";
import { getRawProjectId } from "./project-id.js";
import { getEnvironmentData } from "./environment.js";
import { cyan } from "colorette";
const TELEMETRY_API = "https://telemetry.sst.dev/events";
const TELEMETRY_KEY_ENABLED = "telemetry.enabled";
const TELEMETRY_KEY_NOTIFY_DATE = "telemetry.notifiedAt";
const TELEMETRY_KEY_ID = `telemetry.anonymousId`;
const conf = initializeConf();
const sessionId = randomBytes(32).toString("hex");
const projectId = hash(getRawProjectId());
const anonymousId = getAnonymousId();
notify();
export function enable() {
    conf && conf.set(TELEMETRY_KEY_ENABLED, true);
}
export function disable() {
    conf && conf.set(TELEMETRY_KEY_ENABLED, false);
}
export function isEnabled() {
    if (!conf) {
        return false;
    }
    return conf.get(TELEMETRY_KEY_ENABLED, true) !== false;
}
export function trackCli(command) {
    return record("CLI_COMMAND", { command });
}
export function trackCliFailed(event) {
    return record("CLI_COMMAND_FAILED", event);
}
export function trackCliSucceeded(event) {
    return record("CLI_COMMAND_SUCCEEDED", event);
}
export function trackCliDevError(event) {
    return record("CLI_COMMAND_DEV_ERROR", event);
}
export function trackCliDevRunning(event) {
    return record("CLI_COMMAND_DEV_RUNNING", event);
}
function initializeConf() {
    try {
        // @ts-expect-error
        return new Conf({ projectName: "sst" });
    }
    catch (_) {
        return null;
    }
}
function notify() {
    if (!conf || willNotRecord()) {
        return;
    }
    // Do not notify if user has been notified before.
    if (conf.get(TELEMETRY_KEY_NOTIFY_DATE) !== undefined) {
        return;
    }
    conf.set(TELEMETRY_KEY_NOTIFY_DATE, Date.now().toString());
    console.log(`${cyan("Attention")}: SST now collects completely anonymous telemetry regarding usage. This is used to guide SST's roadmap.`);
    console.log(`You can learn more, including how to opt-out of this anonymous program, by heading over to:`);
    console.log("https://docs.sst.dev/anonymous-telemetry");
    console.log();
}
function willNotRecord() {
    return !isEnabled() || !!process.env.SST_TELEMETRY_DISABLED;
}
async function record(name, properties) {
    if (willNotRecord()) {
        return Promise.resolve();
    }
    const context = {
        anonymousId,
        projectId,
        sessionId,
    };
    try {
        await postPayload(TELEMETRY_API, {
            context,
            environment: getEnvironmentData(),
            events: [
                {
                    name,
                    properties,
                },
            ],
        });
    }
    catch { }
}
function getAnonymousId() {
    const val = conf && conf.get(TELEMETRY_KEY_ID);
    if (val) {
        return val;
    }
    const generated = randomBytes(32).toString("hex");
    conf && conf.set(TELEMETRY_KEY_ID, generated);
    return generated;
}
function hash(payload) {
    return createHash("sha256").update(payload).digest("hex");
}
