export interface Notifier {
  notify(message: string, error?: unknown): Promise<void>;
}
