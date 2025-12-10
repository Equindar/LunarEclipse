type ValidationError = {
    error: {
        message: string;
        code: ErrorCode;
        errors: { message: string }[];
    };
};
