"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MysqlDataApiQueryCompiler = exports.PostgresDataApiQueryCompiler = void 0;
const kysely_1 = require("kysely");
class PostgresDataApiQueryCompiler extends kysely_1.PostgresQueryCompiler {
    appendValue(value) {
        const name = this.numParameters;
        this.append(this.getCurrentParameterPlaceholder());
        this.addParameter({
            name: name.toString(),
            ...serialize(value),
        });
    }
    getCurrentParameterPlaceholder() {
        return ":" + this.numParameters;
    }
}
exports.PostgresDataApiQueryCompiler = PostgresDataApiQueryCompiler;
class MysqlDataApiQueryCompiler extends kysely_1.MysqlQueryCompiler {
    appendValue(value) {
        const name = this.numParameters;
        this.append(this.getCurrentParameterPlaceholder());
        this.addParameter({
            name: name.toString(),
            ...serialize(value),
        });
    }
    getCurrentParameterPlaceholder() {
        return ":" + this.numParameters;
    }
}
exports.MysqlDataApiQueryCompiler = MysqlDataApiQueryCompiler;
function serialize(value) {
    switch (typeof value) {
        case "bigint":
            return { value: { doubleValue: Number(value) } };
        case "boolean":
            return { value: { booleanValue: value } };
        case "number":
            if (Number.isInteger(value))
                return { value: { longValue: value } };
            else
                return { value: { doubleValue: value } };
        case "object":
            if (value == null)
                return { value: { isNull: true } };
            else if (Buffer.isBuffer(value))
                return { value: { blobValue: value } };
            else if (value instanceof Date)
                return {
                    typeHint: "TIMESTAMP",
                    value: { stringValue: fixISOString(value.toISOString()) },
                };
            else if (value?.value && isValueObject(value.value)) {
                if (value.typeHint && value.value.stringValue
                    && typeof value.value.stringValue === "string")
                    value.value.stringValue = fixStringValue(value.typeHint, value.value.stringValue);
                return value;
            }
            else
                break;
        case "string":
            return {
                value: { stringValue: value },
            };
    }
    throw new QueryCompilerError("Could not serialize value");
}
function fixStringValue(typeHint, value) {
    switch (typeHint) {
        case "DATE":
            return parseToISOString(value).slice(0, 10);
        case "TIME":
            if (value.match(/^\d{4}-\d{2}-\d{2}/)) {
                return parseToISOString(value).slice(11, 23);
            }
            return fixTimeString(value);
        case "TIMESTAMP":
            return fixISOString(parseToISOString(value));
    }
    return value;
}
function fixTimeString(s) {
    const elements = (s || "00:00:00").split(":");
    while (elements.length < 3) {
        elements.push("00");
    }
    return elements.join(":").slice(0, 12);
}
function fixISOString(s) {
    return s.replace("T", " ").slice(0, 23);
}
function parseToISOString(s) {
    return new Date(Date.parse(s)).toISOString();
}
function isValueObject(value) {
    for (const key of primitiveKeys) {
        if (value[key]) {
            return true;
        }
    }
    if (value.arrayValue) {
        for (const key of arrayKeys) {
            if (value.arrayValue?.[key]) {
                return true;
            }
        }
    }
    return false;
}
class QueryCompilerError extends Error {
    constructor(message) {
        super(message);
        this.name = QueryCompilerError.name;
    }
}
const arrayKeys = ["booleanValues", "doubleValues", "longValues", "stringValues"];
const primitiveKeys = ["blobValue", "booleanValue", "doubleValue", "isNull", "longValue", "stringValue"];
