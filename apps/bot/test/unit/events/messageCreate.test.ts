
import event from "@/events/messageCreate";
import { logger } from "@/utils/logger";
import { Message, OmitPartialGroupDMChannel } from "discord.js";
import { mockMessage } from "test/mocks/mockMessage";


// --- ToDo: issue #12

// jest.mock("../src/utils/logger", () => ({
//   logger: { info: jest.fn() },
// }));

// describe("messageCreate Event", () => {
//   it("should detect share ID", async () => {
//     const message = mockMessage("https://example.com/share/abc123", {
//       guildId: "unknown",
//     });

//     event.execute(message as unknown as Message);

//     expect(logger.info).toHaveBeenCalledWith("Share-ID found: abc123");
//   });
// });
