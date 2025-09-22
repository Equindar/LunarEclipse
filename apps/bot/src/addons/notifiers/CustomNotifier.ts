import { Notifier } from '../../types/Notifier';

export class CustomNotifier implements Notifier {
  async notify(message: string, error?: unknown): Promise<void> {
    // console.error(`${message}`);
    // if (error instanceof Error) {
    //   console.error(error.stack);
    // } else if (error) {
    //   console.error(error);
    // }
  }
}
