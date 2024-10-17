import { createSigner, createVerifier } from "fast-jwt";
import { Config } from "../../../config/index.js";
import { useDomainName, usePathParam, useQueryParam, useQueryParams, } from "../../../api/index.js";
export function LinkAdapter(config) {
    return async function () {
        // @ts-expect-error
        const key = Config[process.env.AUTH_ID + "PrivateKey"];
        // @ts-expect-error
        const publicKey = Config[process.env.AUTH_ID + "PublicKey"];
        const signer = createSigner({
            expiresIn: 1000 * 60 * 10,
            key,
            algorithm: "RS512",
        });
        const callback = "https://" + useDomainName() + "/callback";
        const step = usePathParam("step");
        if (step === "authorize" || step === "connect") {
            const url = new URL(callback);
            const claims = useQueryParams();
            url.searchParams.append("token", signer(claims));
            return {
                type: "step",
                properties: await config.onLink(url.toString(), claims),
            };
        }
        if (step === "callback") {
            const token = useQueryParam("token");
            if (!token)
                throw new Error("Missing token parameter");
            try {
                const verifier = createVerifier({
                    algorithms: ["RS512"],
                    key: publicKey,
                });
                const jwt = verifier(token);
                return {
                    type: "success",
                    properties: jwt,
                };
            }
            catch (ex) { }
        }
    };
}
