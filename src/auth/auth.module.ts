import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { MailModule } from 'src/send-email/send-email.module';


@Module({
    imports: [
    UsersModule ,
    MailModule
    
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
