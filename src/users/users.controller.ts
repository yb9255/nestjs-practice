import { UsersService } from './users.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body.email, body.password);
  }
}
