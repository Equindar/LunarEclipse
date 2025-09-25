declare global {}
namespace Express {
  interface Request {
    apiVersion: string;
    userId?: string;
    permissions?: string[];
  }
}
