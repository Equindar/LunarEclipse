import { TextChannel } from "discord.js";

type MockTextChannelOptions = {
    channelId?: string;
};

export function mockTextChannel(
    options: MockTextChannelOptions = {}
): TextChannel {
    const mockChannel = {
        id: options.channelId ?? "111111",
        send: jest.fn(),
        type: 0,
    } as unknown as TextChannel;
    return mockChannel;
}