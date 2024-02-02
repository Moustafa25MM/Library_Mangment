import request from 'supertest';
import { app } from './../index';
import prisma from '../database';
import bcrypt from 'bcrypt';

const authenticateAndGetToken = async () => {
  const credentials = {
    email: 'admin@example.com',
    password: 'YourSecureAdminPassword',
  };

  const response = await request(app).post('/auth/login').send(credentials);
  return response.body.data.token;
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

let token = '';
describe('Books Controller', () => {
  beforeAll(async () => {
    // Authenticate and store the token before running the tests
    token = await authenticateAndGetToken();

    await prisma.book.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should add a new book successfully', async () => {
    const newBook = {
      title: 'New Test Book',
      author: 'Author Test',
      isbn: '123-4567890123',
      quantity: 5,
      shelfLocation: 'A1',
    };

    const response = await request(app)
      .post('/book/add')
      .set('Authorization', `${token}`) // Include token in the Authorization header
      .send(newBook)
      .expect(201);

    expect(response.body.message).toBe('Book added successfully');
    expect(response.body.data.book).toBeDefined();
    expect(response.body.data.book.isbn).toBe(newBook.isbn);
  });

  it('should delete a book successfully', async () => {
    // Create a book to delete later
    const bookToDelete = await prisma.book.create({
      data: {
        title: 'Book to Delete',
        author: 'Author Test',
        isbn: '123-delete',
        quantity: 1,
        shelfLocation: 'D1',
      },
    });

    const response = await request(app)
      .delete(`/book/delete/${bookToDelete.id}`)
      .set('Authorization', `${token}`) // Include token in the Authorization header
      .expect(200);

    expect(response.body.message).toBe('Book deleted successfully');
  });

  it('should update a book successfully', async () => {
    // Create a book to update later
    const bookToUpdate = await prisma.book.create({
      data: {
        title: 'Original Title',
        author: 'Original Author',
        isbn: '123-update',
        quantity: 10,
        shelfLocation: 'U1',
      },
    });

    // New data for the book
    const updatedData = {
      title: 'Updated Title',
      author: 'Updated Author',
      isbn: '123-updated',
      quantity: 15,
      shelfLocation: 'U2',
    };

    const response = await request(app)
      .put(`/book/update/${bookToUpdate.id}`)
      .set('Authorization', `${token}`)
      .send(updatedData)
      .expect(200);

    expect(response.body.message).toBe('Book updated successfully');
    expect(response.body.data.updatedBook.title).toBe(updatedData.title);
  });

  it('should list all books', async () => {
    const response = await request(app)
      .get('/book/list/books')
      .set('Authorization', `${token}`)
      .expect(200);

    expect(response.body.message).toBe('Books retrieved successfully');
    expect(Array.isArray(response.body.data.books)).toBeTruthy();
  });

  it('should search books by title', async () => {
    // Assuming there are books in the database
    const searchTerm = 'Test Book';
    const response = await request(app)
      .get(`/book/search/books?title=${searchTerm}`)
      .set('Authorization', `${token}`)
      .expect(200);

    expect(response.body.message).toMatch(
      /Books found successfully|No books found with the given criteria./
    );
    response.body.data.books.forEach((book: any) => {
      expect(book.title).toContain(searchTerm);
    });
  });
});
