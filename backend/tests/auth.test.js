import request from 'supertest';
import app from '../index.js';  // Import the app without starting the server
import { describe, expect, it } from 'vitest';
import dotenv from 'dotenv';

dotenv.config(); // Load .env variables for testing environment

describe('POST /signup', () => {
    it('should create a new user', async () => {
      const username = `testuser_${Date.now()}`; // Unique username based on timestamp
      const res = await request(app)
        .post('/api/signup')
        .send({
          username,
          password: 'password123',
          role: 'user'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body.message).toBe('User created');
    });
  
    it('should return 400 if user already exists', async () => {
      const res = await request(app)
        .post('/api/signup')
        .send({
          username: 'testuser', // This user is expected to exist already
          password: 'password123',
          role: 'user'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toBe('User already exists');
    });
  });
  