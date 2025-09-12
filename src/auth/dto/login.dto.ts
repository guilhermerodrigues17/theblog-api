import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @IsNotEmpty({ message: 'field email cannot be empty' })
  email: string;

  @IsString({ message: 'field password must be a string' })
  @IsNotEmpty({ message: 'field password cannot be empty' })
  password: string;
}
