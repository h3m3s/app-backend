import { IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  usernameOrEmail: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
