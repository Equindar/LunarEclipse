describe("server", () => {
    it("should load env vars from .env", () => {
        expect(process.env.PORT).toBeDefined();
        expect(process.env.API_NAME).toBeDefined();
    });
});