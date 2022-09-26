import {
  Body,
  Controller,
  Post,
  Get,
  Patch,
  Param,
  Query,
  Delete,
  NotFoundException,
  BadRequestException,
  HttpCode,
  Session,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { QueryFailedError } from 'typeorm';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDTo } from './dto/create-user.dto';
import { UpdateUserDTo } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  WhoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async createUser(@Body() body: CreateUserDTo, @Session() session: any) {
    try {
      const { email, password } = body;
      const user = await this.authService.signUp(email, password);
      session.userId = user.id;
      return user;
    } catch (e) {
      if (
        e instanceof QueryFailedError &&
        e.message.includes('UNIQUE constraint failed')
      ) {
        throw new BadRequestException('email already in use');
      }
      throw e;
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signIn(@Body() body: CreateUserDTo, @Session() session: any) {
    const { email, password } = body;
    const user = await this.authService.signIn(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDTo) {
    return this.usersService.update(+id, body);
  }
}
