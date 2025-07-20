import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { forgotPasswordDto, LoginDto, SignUpDto, VerifyPassResetCodeDto, } from './dto/auth.dto';
import { ValidationPipe } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body(new ValidationPipe({ forbidNonWhitelisted: true }))signUpDto: SignUpDto) {

    return this.authService.signup(signUpDto);

  }
@Post('login')
login(@Body(new ValidationPipe({forbidNonWhitelisted:true})) loginDto:LoginDto){
  return this.authService.login(loginDto);
}
// @desc    Forgot password
// @route   POST /api/v1/auth/forgotPassword
// @access  Public
@Post('forgotPassword')
forgotPassword(@Body() forgotPasswordDto:forgotPasswordDto){
    return this.authService.forgotPassword(forgotPasswordDto)
}
// @desc    Verify password reset code
// @route   POST /api/v1/auth/verifyResetCode
// @access  Public

@Post('verifyResetCode')
verifyResetCode(@Body() verifyPassResetCodeDto:VerifyPassResetCodeDto){
    return this.authService.verifyPassResetCode(verifyPassResetCodeDto)
}
// @desc    Reset password
// @route   POST /api/v1/auth/resetPassword
// @access  Public
@Post('resetPassword')
resetPassword(@Body() verifyPassResetCodeDto:VerifyPassResetCodeDto){
    return this.authService.resetPassword(verifyPassResetCodeDto)
}
}
