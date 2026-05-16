import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private auth: AuthService) {}

  @Post('register')
  register(@Body() body: CreateUserDto) {
    return this.auth.register(body.email, body.password);
  }

  @Post('login')
  login(@Body() body: LoginDto) {
    return this.auth.login(body.email, body.password);
  }
  @UseGuards(AuthGuard('jwt'))
  @Get('me')
  getUser(@Req() req) {
    return this.auth.getUser(req.user.userId);
  }
}
