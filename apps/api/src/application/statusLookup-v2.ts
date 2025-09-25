import { Status } from "../types/status";
import { StatusLookup } from "./interfaces/statusLookup";

export class StatusLookupV2 implements StatusLookup {
    async execute(): Promise<Status> {
        return { online: true, latency: 200 };
    }

}