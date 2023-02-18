import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);
const HASH_LENGTH = 32;

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.findBy(email);

    if (users.length > 0) {
      throw new BadRequestException('email in use');
    }

    // Hash the user's password
    // 1) Generate Salt
    const salt = randomBytes(8).toString('hex');

    // 2) Hash the salt and the password together
    const hash = (await scrypt(password, salt, HASH_LENGTH)) as Buffer;

    // 3) Join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;

    // Create a new user and save it
    const user = await this.usersService.create(email, result);

    // Return the user
    return user;
  }

  async signin() {}
}
