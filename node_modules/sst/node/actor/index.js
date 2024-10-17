import { create } from "../../context/context2.js";
import { SSTError } from "../../util/error.js";
export class WrongActorError extends SSTError {
}
export function createActors() {
    const ctx = create("Actors");
    return {
        useActor: ctx.use,
        withActor: ctx.with,
        assertActor(type) {
            const actor = ctx.use();
            if (actor.type === type)
                return actor.properties;
            throw new WrongActorError(`Expected actor type "${type} but got "${actor.type}"`);
        },
    };
}
