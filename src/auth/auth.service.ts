import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { PrismaService } from 'src/config/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/domain/user';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { User as Userdb } from '@prisma/client';
import { AuthUpdateDto } from './dto/auth-update.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async validateLogin(loginDto: AuthLoginDto): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findFirst({
      where: { username: loginDto.username },
    });

    if (!user) {
      throw new BadRequestException('Username not Found');
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

    return {
      token: token,
      user: this.userResponse(user),
    };
  }

  userResponse(user: Userdb): User {
    return {
      username: user.username,
      email: user.email,
      name: user.name,
      role: user.role,
      imgUrl: user.imgUrl,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  }

  async register(registerDto: AuthRegisterDto): Promise<AuthResponseDto> {
    const sameUsername = await this.prismaService.user.count({
      where: { username: registerDto.username },
    });
    if (sameUsername > 0) {
      throw new BadRequestException('Username already exists');
    }

    const sameEmail = await this.prismaService.user.count({
      where: { email: registerDto.email },
    });
    if (sameEmail > 0) {
      throw new BadRequestException('Email already exists');
    }

    registerDto.password = await bcrypt.hash(registerDto.password, 10);

    const data = await this.prismaService.user.create({
      data: {
        username: registerDto.username,
        email: registerDto.email,
        name: registerDto.name,
        password: registerDto.password,
      },
    });

    const token = await this.jwtService.signAsync({
      sub: data.username,
      email: data.email,
      role: data.role,
    });

    return {
      token: token,
      user: this.userResponse(data),
    };
  }

  async me(username: string): Promise<User> {
    const user = await this.prismaService.user.findFirst({
      where: { username: username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    return this.userResponse(user);
  }

  async update(
    username: string,
    updateDto: AuthUpdateDto,
  ): Promise<AuthResponseDto> {
    const user = await this.prismaService.user.findFirst({
      where: { username: username },
    });
    if (!user) {
      throw new BadRequestException('User not found');
    }

    const userWithSameUsername = await this.prismaService.user.count({
      where: { username: updateDto.username },
    });
    if (userWithSameUsername > 0) {
      throw new BadRequestException('Username already exists');
    }

    if (updateDto.password !== updateDto.confirm_password) {
      throw new BadRequestException('Password not match');
    }

    if (updateDto.username) {
      user.username = updateDto.username;
    }
    if (updateDto.name) {
      user.name = updateDto.name || user.name;
    }
    if (updateDto.password) {
      user.password = await bcrypt.hash(updateDto.password, 10);
    }
    const data = await this.prismaService.user.update({
      where: { username: username },
      data: user,
    });

    const token = await this.jwtService.signAsync({
      sub: data.username,
      email: data.email,
      role: data.role,
    });

    return {
      token: token,
      user: this.userResponse(data),
    };
  }
}
