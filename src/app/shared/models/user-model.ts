export interface User {
  jwt_token: string;
  username: string;
  role: string;
  name: string;
  email: string;
  exp: number;
}

export class UserModel implements User
 {
  constructor(
    public jwt_token: string,
    public username: string,
    public role: string,
    public name: string,
    public email: string,
    public exp: number
  ) {}
}
