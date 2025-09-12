import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'field password must be a string' })
  @IsNotEmpty({ message: 'field password cannot be empty' })
  currentPassword: string;

  @IsString({ message: 'the new password must be a string' })
  @IsNotEmpty({ message: 'the new password cannot be empty' })
  @MinLength(6, { message: 'the new password is too short (min 6 characters)' })
  newPassword: string;
}
