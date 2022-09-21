import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDTo } from './dto/create-user.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  createUser(@Body() body: CreateUserDTo) {
    const { email, password } = body;
    this.usersService.create(email, password);
  }
}
