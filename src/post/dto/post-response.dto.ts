import { User } from 'src/user/entities/user.entity';
import { Post } from '../entities/post.entity';

export class PostResponseDto {
  readonly id: string;
  readonly title: string;
  readonly slug: string;
  readonly excerpt: string;
  readonly content: string;
  readonly coverImageUrl: string;
  readonly published: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly author: Pick<User, 'id' | 'email' | 'name'>;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.slug = post.slug;
    this.excerpt = post.excerpt;
    this.content = post.content;
    this.coverImageUrl = post.coverImageUrl;
    this.published = post.published;
    this.createdAt = post.createdAt;
    this.updatedAt = post.updatedAt;
    this.author = {
      id: post.author.id,
      name: post.author.name,
      email: post.author.email,
    };
  }
}
