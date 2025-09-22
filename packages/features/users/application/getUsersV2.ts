import { User } from "../domain/user";

export class GetUsersV2 {
    execute(): User[] {
        // In v2 liefern wir die kompletten User-Objekte zurück
        return [
            { id: "1", name: "Alice" },
            { id: "2", name: "Bob" },
        ];
    }
}
