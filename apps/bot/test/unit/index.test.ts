describe("Configuration", () => {
    it("should load env vars from .env", () => {
        expect(process.env.DISCORD_TOKEN).toBeDefined();
        expect(process.env.DISCORD_SERVER_ID).toBeDefined();
        expect(process.env.DISCORD_CLIENT_ID).toBeDefined();
    });
});
