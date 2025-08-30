import { Controller, Post, Body, Headers, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerData: any) {
    return this.authService.register(registerData);
  }

  @Post('login')
  async login(@Body() loginData: any) {
    return this.authService.login(loginData);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Body() refreshData: any) {
    return this.authService.refreshToken(refreshData);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: { email: string }) {
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetData: any) {
    return this.authService.resetPassword(resetData);
  }
}
