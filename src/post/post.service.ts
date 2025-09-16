import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Repository } from 'typeorm';
import { Post } from './entities/post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { createSlugFromText } from 'src/common/utils/create-slug-from-text';

@Injectable()
export class PostService {
  readonly logger: Logger = new Logger(PostService.name);

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
  ) {}

  async create(dto: CreatePostDto, author: User) {
    const post = this.postRepository.create({
      slug: createSlugFromText(dto.title),
      title: dto.title,
      excerpt: dto.excerpt,
      content: dto.content,
      coverImageUrl: dto.coverImageUrl,
      author,
    });

    const postCreated = await this.postRepository
      .save(post)
      .catch((e: unknown) => {
        if (e instanceof Error) {
          this.logger.error('create post error', e.stack);
        }
        throw new BadRequestException(
          'an error occurred while creating the post',
        );
      });
    return postCreated;
  }

  async findOneOwned(postData: Partial<Post>, author: User) {
    const post = await this.postRepository.findOne({
      where: {
        ...postData,
        author: { id: author.id },
      },
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('post not found');

    return post;
  }

  async findOne(postData: Partial<Post>) {
    const post = await this.postRepository.findOne({
      where: postData,
      relations: ['author'],
    });

    if (!post) throw new NotFoundException('post not found');

    return post;
  }

  async findOnePublic(postData: Partial<Post>) {
    const post = await this.findOne({ ...postData, published: true });
    return post;
  }

  async findAllOwned(author: User) {
    const posts = await this.postRepository.find({
      where: {
        author: { id: author.id },
      },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });

    return posts;
  }

  findAllPublic() {
    return this.postRepository.find({
      where: { published: true },
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(postData: Partial<Post>, dto: UpdatePostDto, author: User) {
    if (Object.keys(dto).length === 0) {
      throw new BadRequestException('invalid data');
    }

    const post = await this.findOneOwned(postData, author);

    post.title = dto.title ?? post.title;
    post.excerpt = dto.excerpt ?? post.excerpt;
    post.content = dto.content ?? post.content;
    post.published = dto.published ?? post.published;
    post.coverImageUrl = dto.coverImageUrl ?? post.coverImageUrl;

    return this.postRepository.save(post);
  }

  async remove(postData: Partial<Post>, author: User) {
    const post = await this.findOne(postData);
    await this.postRepository.delete({
      ...postData,
      author: { id: author.id },
    });

    return post;
  }
}
