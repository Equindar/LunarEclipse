import { Status } from "../types/status";
import { StatusLookup } from "./interfaces/statusLookup";

export class StatusLookupV1 implements StatusLookup {
    async execute(): Promise<Status> {
        return { online: true, latency: 100 };
    }

}