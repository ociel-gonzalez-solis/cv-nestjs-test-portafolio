import { IsEmail, IsString } from 'class-validator';

export class CreateUserDTo {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}
