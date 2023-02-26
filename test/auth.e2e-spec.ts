import { AppModule } from './../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles a signup request', async () => {
    const user = {
      email: 'afdsfsadfsadfs@afafdsdfsafads.com',
      password: '12345',
    };

    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send(user)
      .expect(201);

    const { id, email } = response.body;

    expect(id).toBeDefined();
    expect(email).toEqual(user.email);
  });
});
