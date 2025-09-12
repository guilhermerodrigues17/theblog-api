import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'field name must be a string' })
  @IsNotEmpty({ message: 'field name cannot be empty' })
  @MinLength(3, { message: 'name is too short' })
  @MaxLength(100, { message: 'name is too long' })
  name: string;

  @IsEmail()
  @IsNotEmpty({ message: 'field email cannot be empty' })
  email: string;

  @IsString({ message: 'field password must be a string' })
  @IsNotEmpty({ message: 'field password cannot be empty' })
  @MinLength(6, { message: 'password is too short' })
  password: string;
}
