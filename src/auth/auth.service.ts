import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import { HashingService } from 'src/common/hashing/hashing-service.interface';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './types/jwt-payload.type';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const unauthorized = new UnauthorizedException('credentials do not match');

    const user = await this.userService.findByEmail(loginDto.email);
    if (!user) {
      throw unauthorized;
    }

    const isPasswordValid = await this.hashingService.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw unauthorized;
    }

    const tokenPayload: JwtPayload = { sub: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(tokenPayload);

    user.forceLogout = false;
    await this.userService.save(user);

    return { accessToken };
  }
}
