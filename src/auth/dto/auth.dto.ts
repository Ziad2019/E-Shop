import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength,Matches, Validate, IsNumber } from 'class-validator';


export class SignUpDto {
  // Name
  @IsString({ message: 'Name must be a string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  @MaxLength(30, { message: 'Name must be at most 30 characters' })
  name: string;

  // Email
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  // Password
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  
  // @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
  //   message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
  // })

  password: string;
}
export class LoginDto {
   // Email
  @IsString({ message: 'Email must be a string' })
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  email: string;

  // Password
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(3, { message: 'Password must be at least 3 characters' })
  @MaxLength(20, { message: 'Password must be at most 20 characters' })
  password: string;

  // Confirm Password
//   @IsString({ message: 'Confirm Password must be a string' })
//   @IsNotEmpty({ message: 'Confirm Password is required' })
//   @Validate(PasswordMatchConstraint, ['password'], { message: 'Confirm Password must match Password' })
//   confirmPassword: string;
}

export class forgotPasswordDto{
 @IsEmail()
  email:string
}

export class VerifyPassResetCodeDto{
 @IsNumber()
  resetCode:number
}

export class resetPasswordDto {

@IsEmail()
  email:string

  newPassword:string
}