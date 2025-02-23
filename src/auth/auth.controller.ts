import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { WebResponseDto } from 'src/config/dto/web-response.dto';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { Request } from 'express';
import { User } from 'src/user/domain/user';
import { JwtRoleGuard } from 'src/config/guards/jwtrole.guard';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  async login(
    @Body() loginDto: AuthLoginDto,
  ): Promise<WebResponseDto<AuthResponseDto>> {
    const result = await this.authService.validateLogin(loginDto);

    return {
      status: 'success',
      message: 'Login Successfully',
      data: result,
    };
  }

  @Post('register')
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  async register(
    @Body() registerDto: AuthRegisterDto,
  ): Promise<WebResponseDto<AuthResponseDto>> {
    const result = await this.authService.register(registerDto);

    return {
      status: 'success',
      message: 'Register Successfully',
      data: result,
    };
  }

  @Post('editor-register')
  @ApiOkResponse({
    type: AuthResponseDto,
  })
  async registerEditor(
    @Body() registerDto: AuthRegisterDto,
  ): Promise<WebResponseDto<AuthResponseDto>> {
    const result = await this.authService.registerEditor(registerDto);

    return {
      status: 'success',
      message: 'Register Successfully',
      data: result,
    };
  }

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(JwtRoleGuard)
  @ApiOkResponse({
    type: User,
  })
  async me(@Req() request: Request): Promise<WebResponseDto<User>> {
    return {
      status: 'success',
      message: 'Get User Data Successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      data: await this.authService.me(request.user!['sub']),
    };
  }

  @ApiBearerAuth()
  @Patch('update')
  @UseGuards(JwtRoleGuard)
  @ApiOkResponse({
    type: User,
  })
  async update(
    @Req() request: Request,
    @Body() updateDto: AuthUpdateDto,
  ): Promise<WebResponseDto<AuthResponseDto>> {
    return {
      status: 'success',
      message: 'Update User Data Successfully',
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      data: await this.authService.update(request.user!['sub'], updateDto),
    };
  }
}
