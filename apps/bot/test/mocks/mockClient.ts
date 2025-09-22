import { Client, Guild, User } from "discord.js";

export function mockClient(options: {
    userTag?: string;
    userId?: string;
    guilds?: { id: string; name: string }[];
} = {}): Client {
    const client = {
        user: {
            tag: options.userTag ?? "MockBot#0000",
            id: options.userId ?? "999999999999999999",
        } as unknown as User,

        guilds: {
            cache: new Map(
                (options.guilds ?? []).map((g) => [g.id, { id: g.id, name: g.name } as Guild])
            ),
        },

        on: jest.fn(),
        once: jest.fn(),
        emit: jest.fn(),
        login: jest.fn().mockResolvedValue("mocked-token"),
    } as unknown as Client;

    return client;
}
