export interface LoginActivityRepository {
  record(input: {
    userId: number | null;
    attemptedEmail: string | null;
    status: "success" | "failed" | "blocked";
    authMethod: string;
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}
