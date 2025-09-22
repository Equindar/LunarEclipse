import { Message, TextChannel, User } from "discord.js";

type MockMessageOptions = {
    bot?: boolean;
    authorId?: string;
    username?: string;
    channelId?: string;
    guildId?: string;
};

export function mockMessage(
    content: string,
    options: MockMessageOptions = {}
): Message {
    const mockAuthor = {
        bot: options.bot ?? false,
        id: options.authorId ?? "123456",
        username: options.username ?? "TestUser",
        tag: `${options.username ?? "TestUser"}#0000`,
    } as unknown as User;

    const mockChannel = {
        id: options.channelId ?? "111111",
        send: jest.fn(),
        type: 0, // TextChannel in Guild
    } as unknown as TextChannel;

    const mockMessage = {
        id: "999999",
        content,
        author: mockAuthor,
        channel: mockChannel,
        guildId: options.guildId ?? "222222",
        reply: jest.fn(),
        react: jest.fn(),
        delete: jest.fn(),
    } as unknown as Message;

    return mockMessage;
}
