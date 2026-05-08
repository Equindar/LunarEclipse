export function getFileName(messageId: string, done = false) {
  return `./audio/${messageId}${done ? "_done" : ""}.ogg`;
}
