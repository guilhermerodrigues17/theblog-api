import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Length,
} from 'class-validator';

export class CreatePostDto {
  @IsString({ message: 'title must be a string' })
  @Length(10, 150, {
    message: 'title must be between 10 and 150 characters long',
  })
  title: string;

  @IsString({ message: 'excerpt must be a string' })
  @Length(10, 200, {
    message: 'excerpt must be between 10 and 200 characters long',
  })
  excerpt: string;

  @IsString({ message: 'content must be a string' })
  @IsNotEmpty({ message: 'content cannot be empty' })
  content: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  coverImageUrl?: string;
}
