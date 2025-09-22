import createClient from '@/client'

jest.mock("discord.js", () => {
    const original = jest.requireActual("discord.js");
    return {
        ...original,
        Client: jest.fn().mockImplementation(() => ({
            login: jest.fn().mockResolvedValue("mocked-token"),
            on: jest.fn(),
        })),
    };
});

describe("Discord Client", () => {
    it("should login with a token", async () => {
        const client = createClient();
        const token = await client.login("FAKE_TOKEN");

        expect(token).toBe("mocked-token");
        expect(client.login).toHaveBeenCalledWith("FAKE_TOKEN");
    });
});
