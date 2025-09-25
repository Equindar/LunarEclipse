import { StatusLookup } from "../application/interfaces/statusLookup";
import { StatusLookupV1 } from "../application/statusLookup-v1";
import { StatusLookupV2 } from "../application/statusLookup-v2";
import UnsupportedApiVersionError from "../errors/UnsupportedAPIVersion";

const strategies: Record<string, new () => StatusLookup> = {
    '1': StatusLookupV1,
    '2': StatusLookupV2,
};

export class StatusLookupContext {
    private strategy: StatusLookup;

    constructor(version: string) {
        const Strategy = strategies[version];
        if (!Strategy) {
            throw new UnsupportedApiVersionError({
                message: `Unsupported API version: ${version}`,
                statusCode: 400
            });
        }
        this.strategy = new Strategy();
    }

    execute() {
        return this.strategy.execute();
    }
}