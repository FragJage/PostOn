import pool from '../config/database';
import { Task, CreateTaskData, UpdateTaskData, TaskStatus } from './types';

export class TaskModel {
  static async create(taskData: CreateTaskData): Promise<Task> {
    const query = `
      INSERT INTO tasks (title, description, status, user_id, created_at, updated_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      RETURNING *
    `;
    
    const result = await pool.query(query, [
      taskData.title,
      taskData.description || null,
      TaskStatus.PENDING,
      taskData.user_id
    ]);
    return result.rows[0];
  }

  static async findById(id: number): Promise<Task | null> {
    const query = 'SELECT * FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    return result.rows[0] || null;
  }

  static async findByUserId(userId: number): Promise<Task[]> {
    const query = 'SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async update(id: number, updateData: UpdateTaskData): Promise<Task | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    if (updateData.title !== undefined) {
      fields.push(`title = $${paramCount++}`);
      values.push(updateData.title);
    }

    if (updateData.description !== undefined) {
      fields.push(`description = $${paramCount++}`);
      values.push(updateData.description);
    }

    if (updateData.status !== undefined) {
      fields.push(`status = $${paramCount++}`);
      values.push(updateData.status);
    }

    if (fields.length === 0) {
      throw new Error('Aucun champ à mettre à jour');
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE tasks 
      SET ${fields.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM tasks WHERE id = $1';
    const result = await pool.query(query, [id]);
    if(!result.rowCount) return false;
    return result.rowCount > 0;
  }

  static async getAll(): Promise<Task[]> {
    const query = 'SELECT * FROM tasks ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }
}