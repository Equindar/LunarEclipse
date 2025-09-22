import event from "@/events/guildCreate";

import { logger } from "@/utils/logger";
import { Guild } from "discord.js";
import { mockClient } from "test/mocks/mockClient";

jest.mock("../src/utils/logger", () => ({
  logger: { info: jest.fn() },
}));

describe("guildCreate Event", () => {
  it("should log guild name and ID", () => {
    const client = mockClient();
    const mockGuild = { id: "123", name: "TestGuild" } as unknown as Guild;

    event.execute(mockGuild);

    expect(logger.info).toContain(mockGuild.id);
    expect(logger.info).toContain(mockGuild.name);
  });
});
