import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth-login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { WebResponseDto } from 'src/config/dto/web-response.dto';

@ApiTags('Auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async login(
    @Body() loginDto: AuthLoginDto,
  ): Promise<WebResponseDto<LoginResponseDto>> {
    const result = await this.authService.validateLogin(loginDto);

    return {
      status: 'success',
      message: 'Login Successfully',
      data: result,
    };
  }
}
