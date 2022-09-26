import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUserService: Partial<UsersService>;

  beforeEach(async () => {
    //Create a fake copy of the user service
    fakeUserService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });
  it('creates a new user with a salt and hashed password', async () => {
    const user = await service.signUp('abcde@letra.com', 'abcde');

    expect(user.password).not.toEqual('abcde');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // it('throw an error if user signUp with an that is in use', async () => {
  //   // fakeUserService.find = () =>
  //   //   Promise.resolve([
  //   //     { id: 4, email: 'test4@tester.com', password: '2468' } as User,
  //   //   ]);
  //   // await service.signUp('test4@tester.com', '2468');
  //   //   expect.assertions(1);
  //   //   fakeUserService.find = () =>
  //   //     Promise.resolve([
  //   //       { id: 1, email: 'test4@tester.com', password: '2468' } as User,
  //   //     ]);
  //   //   await expect(
  //   //     service.signUp('test41@tester.com', '2468'),
  //   //   ).rejects.toBeInstanceOf(BadRequestException);
  //   fakeUserService.find = () =>
  //     Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);
  //   await expect(service.signUp('asdf@asdf.com', 'asdf')).rejects.toThrow(
  //     BadRequestException,
  //   );
  // });

  // it('throws if signin is called with an unused email', async() => {

  // })
  it('throws an error if user signs up with email that is in use', async () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 4, email: 'test4@tester.com', password: '2468' } as User,
      ]);

    expect.assertions(2);

    try {
      await service.signUp('test4@tester.com', 'pass');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('email already in use');
    }
  });

  it('throws if signin is called with an unused email', async () => {
    try {
      await service.signIn('asdflkj@asdlfkj.com', 'passdflkj');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('user not found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    () => {
    fakeUserService.find = () =>
      Promise.resolve([
        { id: 4, email: 'test4@tester.com', password: '2468' } as User,
      ])}
    try {
      await service.signIn('asdflkj@asdlfkj.com', 'passdflkj');
    } catch (err) {
      expect(err).toBeInstanceOf(NotFoundException);
      expect(err.message).toBe('user not found');
    }
  });
});
