import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { HashingService } from 'src/common/hashing/hashing-service.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}

  async failIfEmailExists(email: string) {
    const exists = await this.userRepository.existsBy({
      email,
    });

    if (exists) {
      throw new ConflictException('Email already exists in database');
    }
  }

  async create(createUserDto: CreateUserDto) {
    await this.failIfEmailExists(createUserDto.email);

    const hashedPassword = await this.hashingService.hash(
      createUserDto.password,
    );

    const newUser: CreateUserDto = {
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
    };

    const userCreated = await this.userRepository.save(newUser);
    return userCreated;
  }

  save(user: User) {
    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  findById(id: string) {
    return this.userRepository.findOneBy({ id });
  }

  findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
