import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserMeController, UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User } from './users.schema';
import { UserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),],
    exports: [MongooseModule], 
  controllers: [UsersController,UserMeController],
  providers: [UsersService],
})
export class UsersModule {}
