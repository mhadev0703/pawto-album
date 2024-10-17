"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagedPolicyAttachment = void 0;
const maybe_parsed_1 = require("../diff/maybe-parsed");
class ManagedPolicyAttachment {
    static parseManagedPolicies(identityArn, arns) {
        return typeof arns === 'string'
            ? [new ManagedPolicyAttachment(identityArn, arns)]
            : arns.map((arn) => new ManagedPolicyAttachment(identityArn, arn));
    }
    constructor(identityArn, managedPolicyArn) {
        this.identityArn = identityArn;
        this.managedPolicyArn = managedPolicyArn;
    }
    equal(other) {
        return this.identityArn === other.identityArn
            && this.managedPolicyArn === other.managedPolicyArn;
    }
    /**
     * Return a machine-readable version of the changes.
     * This is only used in tests.
     *
     * @internal
     */
    _toJson() {
        return (0, maybe_parsed_1.mkParsed)({
            identityArn: this.identityArn,
            managedPolicyArn: this.managedPolicyArn,
        });
    }
}
exports.ManagedPolicyAttachment = ManagedPolicyAttachment;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFuYWdlZC1wb2xpY3kuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJtYW5hZ2VkLXBvbGljeS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSx1REFBNkQ7QUFFN0QsTUFBYSx1QkFBdUI7SUFDM0IsTUFBTSxDQUFDLG9CQUFvQixDQUFDLFdBQW1CLEVBQUUsSUFBdUI7UUFDN0UsT0FBTyxPQUFPLElBQUksS0FBSyxRQUFRO1lBQzdCLENBQUMsQ0FBQyxDQUFDLElBQUksdUJBQXVCLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLHVCQUF1QixDQUFDLFdBQVcsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFFRCxZQUE0QixXQUFtQixFQUFrQixnQkFBd0I7UUFBN0QsZ0JBQVcsR0FBWCxXQUFXLENBQVE7UUFBa0IscUJBQWdCLEdBQWhCLGdCQUFnQixDQUFRO0lBQ3pGLENBQUM7SUFFTSxLQUFLLENBQUMsS0FBOEI7UUFDekMsT0FBTyxJQUFJLENBQUMsV0FBVyxLQUFLLEtBQUssQ0FBQyxXQUFXO2VBQ3RDLElBQUksQ0FBQyxnQkFBZ0IsS0FBSyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7SUFDMUQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksT0FBTztRQUNaLE9BQU8sSUFBQSx1QkFBUSxFQUFDO1lBQ2QsV0FBVyxFQUFFLElBQUksQ0FBQyxXQUFXO1lBQzdCLGdCQUFnQixFQUFFLElBQUksQ0FBQyxnQkFBZ0I7U0FDeEMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztDQUNGO0FBM0JELDBEQTJCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE1heWJlUGFyc2VkLCBta1BhcnNlZCB9IGZyb20gJy4uL2RpZmYvbWF5YmUtcGFyc2VkJztcblxuZXhwb3J0IGNsYXNzIE1hbmFnZWRQb2xpY3lBdHRhY2htZW50IHtcbiAgcHVibGljIHN0YXRpYyBwYXJzZU1hbmFnZWRQb2xpY2llcyhpZGVudGl0eUFybjogc3RyaW5nLCBhcm5zOiBzdHJpbmcgfCBzdHJpbmdbXSk6IE1hbmFnZWRQb2xpY3lBdHRhY2htZW50W10ge1xuICAgIHJldHVybiB0eXBlb2YgYXJucyA9PT0gJ3N0cmluZydcbiAgICAgID8gW25ldyBNYW5hZ2VkUG9saWN5QXR0YWNobWVudChpZGVudGl0eUFybiwgYXJucyldXG4gICAgICA6IGFybnMubWFwKChhcm46IHN0cmluZykgPT4gbmV3IE1hbmFnZWRQb2xpY3lBdHRhY2htZW50KGlkZW50aXR5QXJuLCBhcm4pKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyByZWFkb25seSBpZGVudGl0eUFybjogc3RyaW5nLCBwdWJsaWMgcmVhZG9ubHkgbWFuYWdlZFBvbGljeUFybjogc3RyaW5nKSB7XG4gIH1cblxuICBwdWJsaWMgZXF1YWwob3RoZXI6IE1hbmFnZWRQb2xpY3lBdHRhY2htZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaWRlbnRpdHlBcm4gPT09IG90aGVyLmlkZW50aXR5QXJuXG4gICAgICAgICYmIHRoaXMubWFuYWdlZFBvbGljeUFybiA9PT0gb3RoZXIubWFuYWdlZFBvbGljeUFybjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gYSBtYWNoaW5lLXJlYWRhYmxlIHZlcnNpb24gb2YgdGhlIGNoYW5nZXMuXG4gICAqIFRoaXMgaXMgb25seSB1c2VkIGluIHRlc3RzLlxuICAgKlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIHB1YmxpYyBfdG9Kc29uKCk6IE1heWJlUGFyc2VkPE1hbmFnZWRQb2xpY3lKc29uPiB7XG4gICAgcmV0dXJuIG1rUGFyc2VkKHtcbiAgICAgIGlkZW50aXR5QXJuOiB0aGlzLmlkZW50aXR5QXJuLFxuICAgICAgbWFuYWdlZFBvbGljeUFybjogdGhpcy5tYW5hZ2VkUG9saWN5QXJuLFxuICAgIH0pO1xuICB9XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgTWFuYWdlZFBvbGljeUpzb24ge1xuICBpZGVudGl0eUFybjogc3RyaW5nO1xuICBtYW5hZ2VkUG9saWN5QXJuOiBzdHJpbmc7XG59XG4iXX0=