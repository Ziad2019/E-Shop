import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from 'src/users/users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { forgotPasswordDto, LoginDto, SignUpDto, VerifyPassResetCodeDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException } from '@nestjs/common';
import * as crypto from 'crypto'
import { MailService } from 'src/send-email/send-email.service';


@Injectable()
export class AuthService {
 constructor(
    @InjectModel(User.name)
     private userModel: Model<User>,
     private jwtService:JwtService,
     private mailService:MailService
  ) {}

// @desc    Signup
// @route   post /api/v1/auth/signup
// @access  Public
 async signup(signUpDto: SignUpDto ) {
    
    const existUser= await this.userModel.findOne({email:signUpDto.email})
    if(existUser){
      throw new ConflictException('Email already exists');
    }
    const user= await this.userModel.create(signUpDto)

    const payload={
      sub:user._id,
      email:user.email,
      role:user.role
    }
    const token=await this.jwtService.signAsync(payload,{secret:process.env.JWT_SECRET_KEY})
    
      return {
      status: 201,
      message: 'User created successfully',
      data: user,
      access_token: token
    };
  }

// @desc    login
// @route   post /api/v1/auth/login
// @access  Public
 async login(loginDto: LoginDto ) {
    const user= await this.userModel.findOne({email:loginDto.email})
     if (!user) {
      throw new HttpException('user not found', 400);
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password);
    if (!isMatch) {
      throw new HttpException('password not match', 400);
    }
    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };
    const token=await this.jwtService.signAsync(payload,{secret:process.env.JWT_SECRET_KEY})
    
      return {
      status: 201,
      message: 'User created successfully',
      data: user,
      access_token: token
    };
  }


  async forgotPassword(forgotPasswordDto: { email: string }) {
    let user;
    try {
      // 1) Get user by email
      user = await this.userModel.findOne({ email: forgotPasswordDto.email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      // 2) Generate reset code
      const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedResetCode = crypto
        .createHash('sha256')
        .update(resetCode)
        .digest('hex');

      // 3) Update user with reset code
      user.passwordResetCode = hashedResetCode;
      user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
      user.passwordResetVerified = false;
      await user.save();

      // 4) Send email
      const message = `
        Hi ${user.name},
        
        We received a request to reset the password on your E-shop Account.
        
        Your reset code is: ${resetCode}
        
        Enter this code to complete the reset. This code is valid for 10 minutes.
        
        Thanks for helping us keep your account secure.
        
        The E-shop Team
      `;

      await this.mailService.sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });

      return {
        status: 'success',
        message: 'Reset code sent to email',
      };

    } catch (error) {
      // Reset user fields if email fails
      if (user) {
        user.passwordResetCode = undefined;
        user.passwordResetExpires = undefined;
        user.passwordResetVerified = undefined;
        await user.save();
      }

      throw new HttpException(
        'Failed to send reset code email',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


async verifyPassResetCode(verifyPassResetCodeDto:VerifyPassResetCodeDto) {
  // 1) Get user based on reset code
  const hashedResetCode = crypto
    .createHash('sha256')
     // eslint-disable-next-line
        // @ts-ignore
    .update(verifyPassResetCodeDto.resetCode)
    .digest('hex');

  const user = await this.userModel.findOne({
    passwordResetCode: hashedResetCode,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    throw new HttpException('password expired match', 400)
  }

  // 2) Reset code valid
  user.passwordResetVerified = true;
  await user.save();

   return{
    status: 'Success',
  };
};

async resetPassword(resetPasswordDto) {
  // 1) Get user based on email
  const user = await this.userModel.findOne({ email: resetPasswordDto.email });
  if (!user) {
    
      throw new HttpException(`There is no user with email ${resetPasswordDto.email}`, 404)
    
  }

  // 2) Check if reset code verified
  if (!user.passwordResetVerified) {
   
        throw new HttpException('password verified match', 400)
   
  }

  user.password =resetPasswordDto.newPassword;
   // eslint-disable-next-line
        // @ts-ignore
  user.passwordResetCode = undefined;
   // eslint-disable-next-line
        // @ts-ignore
  user.passwordResetExpires = undefined;
   // eslint-disable-next-line
        // @ts-ignore
  user.passwordResetVerified = undefined;

  await user.save();

  // 3) if everything is ok, generate token
   const payload={
      sub:user._id,
      email:user.email,
      role:user.role
    }
    const token=await this.jwtService.signAsync(payload,{secret:process.env.JWT_SECRET_KEY})
  return{ token };
};
}

