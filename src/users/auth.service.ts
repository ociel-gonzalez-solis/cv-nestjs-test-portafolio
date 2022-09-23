import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from './users.service';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
//? Creation of a user
  async signIp(email: string, password: string) {
    //see if email is in use
    const users = await this.usersService.find(email);
    if (users){
        throw new BadRequestException('email in use')
    }
    //hash user password
    //create a new user and save it
    //return user
  }

  signIn(){}
}
