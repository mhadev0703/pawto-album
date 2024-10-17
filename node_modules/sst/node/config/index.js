import { createProxy, getVariables2 } from "../util/index.js";
export const Config = /* @__PURE__ */ createProxy("Config");
const metadata = parseMetadataEnvironment();
const parameters = flattenValues(getVariables2("Parameter"));
const secrets = flattenValues(getVariables2("Secret"));
Object.assign(Config, metadata, parameters, secrets);
///////////////
// Functions
///////////////
function parseMetadataEnvironment() {
    return {
        APP: process.env.SST_APP,
        STAGE: process.env.SST_STAGE,
    };
}
function flattenValues(configValues) {
    const acc = {};
    Object.keys(configValues).forEach((name) => {
        acc[name] = configValues[name].value;
    });
    return acc;
}
