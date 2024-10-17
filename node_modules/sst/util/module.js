import url from "url";
export async function dynamicImport(input) {
    const { href } = url.pathToFileURL(input);
    return import(href);
}
