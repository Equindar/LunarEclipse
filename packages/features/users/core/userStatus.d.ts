export interface UserStatus {
  init(): void;
  activate(): void;
  block(): void;
  archive(): void;
}
