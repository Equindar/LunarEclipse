import ping from "@/commands/ping";

describe("Ping Command", () => {
    it("should reply with Pong!", async () => {
        const mockReply = jest.fn();

        const mockInteraction = {
            reply: mockReply,
        } as any;

        await ping.execute(mockInteraction);

        expect(mockReply).toHaveBeenCalledWith("Pong!");
    });
});
