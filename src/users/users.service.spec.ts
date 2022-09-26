import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  //mock of users db
  let usersCollection = [
    { id: 1099, email: 'super@user.com', password: 'pass!@#' } as User,
    { id: 2099, email: 'regular@user.com', password: 'pass!@#' } as User,
    { id: 3099, email: 'john.doe@user.com', password: 'pass!@#' } as User,
  ];

  //mock of Repository<User>
  let fakeUsersRepository = {
    findOne: (id: number) => {
      return Promise.resolve(usersCollection.find((c) => c.id === id));
    },
    find: (email: string) => {
      return Promise.resolve(
        usersCollection.filter((c) => c.email === 'john.doe@user.com'),
      );
    },
    remove: () => {},
    update: () => {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('returns user with id 2099', async () => {
    const user = await service.findOne(2099);

    expect.assertions(3);

    expect(user).toBeDefined();
    expect(user.id).toBe(2099);
    expect(user.email).toBe('regular@user.com');
  });

  it('filters users db by email, returns an array with one user', async () => {
    const filteredUsers = await service.find('john.doe@user.com');

    expect(filteredUsers).toBeDefined();
    expect(filteredUsers.length).toBe(1);

    var user = filteredUsers[0];

    expect(user.email).toBe('john.doe@user.com');
    expect(user.id).toBe(3099);

    expect.assertions(4);
  });
});
