import { Message, TextChannel, User } from "discord.js";
import { DeepPartial } from "../types/DeepPartial";

export function mockMessage(
    content: string,
    options: {
        bot?: boolean;
        authorId?: string;
        username?: string;
        guildId?: string;
        channelId?: string;
    } = {}
): DeepPartial<Message> {
    const mockAuthor: DeepPartial<User> = {
        bot: options.bot ?? false,
        id: options.authorId ?? "1234567890",
        username: options.username ?? "TestUser",
        tag: `${options.username ?? "TestUser"}#0000`,
    };

    const mockChannel: DeepPartial<TextChannel> = {
        id: options.channelId ?? "987654321",
        send: jest.fn(),
        type: 0, // TextChannel = 0
    };

    const mockMessage: DeepPartial<Message> = {
        id: "1111111111",
        content,
        author: mockAuthor as User,
        channel: mockChannel as TextChannel,
        guildId: options.guildId ?? "2222222222",
        reply: jest.fn(),
        react: jest.fn(),
        delete: jest.fn(),
    };

    return mockMessage;
}
