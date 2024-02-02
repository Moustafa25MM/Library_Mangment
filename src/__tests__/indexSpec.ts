import request from 'supertest';
import { app } from './../index';
import prisma from '../database';
import bcrypt from 'bcrypt';

const authenticateAndGetToken = async () => {
  const credentials = {
    email: 'testUser@example.com',
    password: 'password',
  };

  const response = await request(app).post('/auth/login').send(credentials);
  return response.body.token;
};

describe('User Routes', () => {
  beforeAll(async () => {
    // Clear out the borrowings and users tables
    await prisma.borrowing.deleteMany({});
    await prisma.user.deleteMany({});
    // Create a test user
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testUser@example.com',
        password: await bcrypt.hash('password', 12),
        role: 'BORROWER',
      },
    });
  });

  afterAll(async () => {
    // Disconnect Prisma client after all tests
    await prisma.$disconnect();
  });

  it('should create a new user successfully', async () => {
    const newUser = {
      name: 'New Test User',
      email: 'newTestUser@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/auth/register')
      .send(newUser)
      .expect(201);

    expect(response.body.message).toBe('user created successfully');
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBe(newUser.email);
  });

  it('should log in user successfully', async () => {
    const credentials = {
      email: 'testUser@example.com',
      password: 'password',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(credentials)
      .expect(200);

    expect(response.body.data.token).toBeDefined();
    expect(response.body.data.user).toBeDefined();
    expect(response.body.data.user.email).toBe(credentials.email);
  });

  it('should fail to log in with incorrect credentials', async () => {
    const credentials = {
      email: 'testUser@example.com',
      password: 'wrongpassword',
    };

    const response = await request(app)
      .post('/auth/login')
      .send(credentials)
      .expect(401);

    expect(response.body.error).toBe('Invalid email or password');
  });
});
