import { Controller, Post, Body, Headers, UseGuards, Get, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendPhoneVerificationDto, VerifyPhoneDto } from './dto/phone-verification.dto';
import { ForgotPasswordDto } from './dto/forgot-passsword.dto'; 

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Post('login')
  async login(@Body() loginData: LoginDto) {
    return this.authService.login(loginData);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Body() refreshData: RefreshTokenDto) {
    return this.authService.refreshToken(refreshData);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() data: ForgotPasswordDto) {
    return this.authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() resetData: ResetPasswordDto) {
    return this.authService.resetPassword(resetData);
  }

  @Post('send-phone-verification')
  async sendPhoneVerification(@Body() data: SendPhoneVerificationDto) {
    return this.authService.sendPhoneVerification(data);
  }

  @Post('verify-phone')
  async verifyPhone(@Body() data: VerifyPhoneDto) {
    return this.authService.verifyPhone(data);
  }

  @Post('resend-phone-verification')
  async resendPhoneVerification(@Body() data: SendPhoneVerificationDto) {
    return this.authService.resendPhoneVerification(data);
  }
}