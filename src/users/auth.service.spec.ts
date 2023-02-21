import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { IDENTIFIER } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  const fakeUsersService: Partial<UsersService> = {
    findBy: () => Promise.resolve([]),
    create: (email: string, password: string) => {
      return Promise.resolve({ id: 1, email, password } as User);
    },
  };

  beforeEach(async () => {
    // create fake copy of users service

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of a service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('asdf@asdf.com', 'asdf1234!');
    expect(user.password).not.toEqual('asdf1234!');

    const [salt, hash] = user.password.split(IDENTIFIER);
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });
});
