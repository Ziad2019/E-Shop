import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './users.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { useContainer } from 'class-validator';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name)
  private userModel:Model<User>,
   ){}
  //  @docs   Admin Can Create User
  //  @Route  POST /api/v1/users
  //  @access Private [admin]
 async create(createUserDto: CreateUserDto) {
    const existUser=await this.userModel.findOne({email:createUserDto.email})
    if(existUser){
      throw new HttpException("User already esist",400)
    }
    const user=await this.userModel.create(createUserDto);
     return {
      status: 201,
      message: 'User created successfully',
      data: user
    };
  }
  //  @docs   Admin Can Create User
  //  @Route  POST /api/v1/users
  //  @access Private [admin]
   async findAll(query) {
      const {
      _limit = 1000_000_000,
      skip = 0,
      sort = 'asc',
      name,
      email,
      role,
    } = query;
        // or=> whare by all keyword, RegExp=> whare by any keyword
    const user = await this.userModel
      .find()
      .skip(skip)
      .limit(_limit)
      .where('name', new RegExp(name, 'i'))
      .where('email', new RegExp(email, 'i'))
      .where('role', new RegExp(role, 'i'))
      .sort({ name: sort })
      .select('-password -__v')
      .exec();

     return {
      status: 200,
      message: 'Users founded successfully',
      length: user.length,
      data: user
    };
  }
  //  @docs   Admin Can Get Single User
  //  @Route  GET /api/v1/users/:id
  //  @access Private [admin]
 async findOne(id: string) {
    const user=await this.userModel.findById(id)
    if(!user){
      throw new NotFoundException();
    }
 return {
      status: 200,
      message: 'User founded successfully',
      data: user
    };
  }
  //  @docs   Admin Can Update Single User
  //  @Route  UPDATE /api/v1/users/:id
  //  @access Private [admin]
  async update(id: string, updateUserDto: UpdateUserDto) {
    const user=await this.userModel.findByIdAndUpdate(id,updateUserDto,{new:true})
    if(!user){
      throw new NotFoundException();
    }
     user.save();
     return {
      status: 200,
      message: 'User update successfully',
      data: user
    };
  }

 async remove(id: string) {
     const user=await this.userModel.findByIdAndDelete(id)
    if(!user){
      throw new NotFoundException();
    }

     return {
      status: 200,
      message: 'User delete successfully',
      data: user
    };
  }

    // ===================== For User =====================
  // User Can Get Data
  //  @docs   Any User can get data on your account
  //  @Route  GET /api/v1/users/me
  //  @access Private [user, admin]
  async getMe(payload){
    
     if(!payload.id){
      throw new NotFoundException()
     }
     const user = await this.userModel.findById(payload.id).select('-password -__v');
   if(!user){
    throw new NotFoundException("dddd")
   }
      return {
      status: 200,
      message: 'User found successfully',
      data: user
    };
  }
  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/userMe
  //  @access Private [user, admin]
  async updateMe(payload,updateUserDto:UpdateUserDto){
 if(!payload.id){
      throw new NotFoundException()
     }
     const user=await this.userModel.findOneAndUpdate(payload.id,updateUserDto,{new:true})
     if(!user){
      throw new NotFoundException()
     }
     return {
      status: 200,
      message: 'User update successfully',
      data: user
    };
  }
  //  @docs   Any User can unActive your account
  //  @Route  DELETE /api/v1/user/me
  //  @access Private [user]
  async deleteMe(payload){
     if(!payload.id){
      throw new NotFoundException()
     }
     const user=await this.userModel.findOneAndDelete(payload.id)
       return {
      status: 200,
      message: 'User delete successfully',
      data: user
    };
  }
  
}
