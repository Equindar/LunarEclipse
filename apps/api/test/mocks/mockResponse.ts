import { Response } from "express";

export const mockResponse = {
    setHeader: jest.fn(),
    send: jest.fn(),
    json: jest.fn(),
} as unknown as Response