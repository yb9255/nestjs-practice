import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findBy(email) {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User]);
      },
      findOneBy(id) {
        return Promise.resolve({
          id,
          email: 'asdf@asdf.com',
          password: 'asdf',
        } as User);
      },
      // remove(id) {
      // },
      // update(id, attrs) {
      // },
    };
    fakeAuthService = {
      // signup()  {},
      // signin() {}
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllUsers returns a list of users with given the email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com');

    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('asdf@asdf.com');
  });

  it('findUser returns a user with given the id', async () => {
    const user = await controller.findUser('1');

    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOneBy = (id) => {
      return Promise.resolve(null);
    };

    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  });
});
