export interface User {
  id: string;
  nickname: string;
  password: string;
  status: 'active' | 'inactive';
}
