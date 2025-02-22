import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { PrismaService } from 'src/config/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/domain/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<LoginResponseDto> {
    const user = await this.prismaService.user.findFirst({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new BadRequestException('Username or Password is Wrong');
    }

    const validPassword = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!validPassword) {
      throw new BadRequestException('Username or Password is Wrong');
    }

    const token = await this.jwtService.signAsync({
      sub: user.username,
      email: user.email,
      role: user.role,
    });

    const userData: User = {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      imgUrl: user.imgUrl,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    return {
      token: token,
      user: userData,
    };
  }
}
