import {  Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Controller,Req, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/decorators/roles/roles.decorator';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //  @docs   Admin Can Create User
  //  @Route  POST /api/v1/users
  //  @access Private [admin]
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  //  @docs   Admin Can Get All Users
  //  @Route  GET /api/v1/users
  //  @access Private [admin]
  @UseGuards(AuthGuard)
  @Roles('admin')
  @Get()
  findAll(@Query()query) {
    return this.usersService.findAll(query);
  }
  //  @docs   Admin Can Get Single User
  //  @Route  GET /api/v1/users/:id
  //  @access Private [admin]
  @Get(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  //  @docs   Admin Can Update Single User
  //  @Route  UPDATE /api/v1/users/:id
  //  @access Private [admin]
  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }
 //  @docs   Admin Can Update Single User
  //  @Route  UPDATE /api/v1/users/:id
  //  @access Private [admin]
  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}

@Controller('userMe')
export class UserMeController{
  constructor(private readonly usersServices:UsersService){}
  // For User
  //  @docs   Any User can get data on your account
  //  @Route  GET /api/v1/userMe
  //  @access Private [user, admin]
  @Get()
  @UseGuards(AuthGuard)
  @Roles('admin','user')
  getMe(@Req() req){
    
      return this.usersServices.getMe(req.user)
  }
  //  @docs   Any User can update data on your account
  //  @Route  PATCH /api/v1/userMe
  //  @access Private [user, admin]
  @Patch()
  @UseGuards(AuthGuard)
  @Roles('admin','user')
  updateMe(@Req() req ,@Body(new ValidationPipe({forbidNonWhitelisted:true}))updateUserDto:UpdateUserDto){
    return this.usersServices.updateMe(req.user,updateUserDto)
  }
  //  @docs   Any User can unActive your account
  //  @Route  DELETE /api/v1/userMe
  //  @access Private [user]
  @Delete()
  @UseGuards(AuthGuard)
  @Roles("user")
  deleteModel(@Req() req){
    return this.usersServices.deleteMe(req.user)
  }
}
