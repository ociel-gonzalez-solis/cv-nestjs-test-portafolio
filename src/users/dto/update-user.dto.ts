import { IsEmail, IsString, IsOptional } from 'class-validator';

export class UpdateUserDTo {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  password: string;
}
