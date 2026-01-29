import pool from '../config/database';
import { User, CreateUserData } from './types';

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const query = `
      INSERT INTO users (username, created_at, updated_at)
      VALUES ($1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const result = await pool.query(query, [userData.username]);
    return result.rows[0];
  }

  static async findByUsername(username: string): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);
    return result.rows[0] || null;
  }

  static async findById(id: number): Promise<User | null> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async getAll(): Promise<User[]> {
    const query = 'SELECT * FROM users ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}