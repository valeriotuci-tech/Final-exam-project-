import { Pool } from 'pg';

describe('Database Migration Tests', () => {
  let pool: Pool;

  beforeAll(() => {
    // Create a test database connection
    pool = new Pool({
      connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/tastyfund_test',
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('Database Connection', () => {
    it('should connect to database', async () => {
      const result = await pool.query('SELECT 1 as value');
      expect(result.rows[0].value).toBe(1);
    });

    it('should have correct database version', async () => {
      const result = await pool.query('SELECT version()');
      expect(result.rows[0].version).toContain('PostgreSQL');
    });
  });

  describe('Table Existence', () => {
    it('should have users table', async () => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'users'
        );
      `);
      
      expect(result.rows[0].exists).toBe(true);
    });

    it('should have campaigns table', async () => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'campaigns'
        );
      `);
      
      expect(result.rows[0].exists).toBe(true);
    });

    it('should have investments table', async () => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'investments'
        );
      `);
      
      expect(result.rows[0].exists).toBe(true);
    });

    it('should have restaurants table', async () => {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'restaurants'
        );
      `);
      
      expect(result.rows[0].exists).toBe(true);
    });
  });

  describe('Table Structure', () => {
    it('should have correct users table columns', async () => {
      const result = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);

      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('email');
      expect(columns).toContain('password_hash');
      expect(columns).toContain('name');
    });

    it('should have correct campaigns table columns', async () => {
      const result = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'campaigns'
        ORDER BY ordinal_position;
      `);

      const columns = result.rows.map(row => row.column_name);
      
      expect(columns).toContain('id');
      expect(columns).toContain('restaurant_id');
      expect(columns).toContain('title');
      expect(columns).toContain('target_amount');
    });
  });

  describe('Constraints and Indexes', () => {
    it('should have primary key on users table', async () => {
      const result = await pool.query(`
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'users' AND constraint_type = 'PRIMARY KEY';
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('should have unique constraint on users email', async () => {
      const result = await pool.query(`
        SELECT constraint_name, constraint_type
        FROM information_schema.table_constraints
        WHERE table_name = 'users' AND constraint_type = 'UNIQUE';
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });

    it('should have foreign key constraints', async () => {
      const result = await pool.query(`
        SELECT constraint_name, table_name
        FROM information_schema.table_constraints
        WHERE constraint_type = 'FOREIGN KEY';
      `);

      expect(result.rows.length).toBeGreaterThan(0);
    });
  });

  describe('Data Integrity', () => {
    it('should enforce NOT NULL constraints', async () => {
      try {
        await pool.query(`
          INSERT INTO users (email, password_hash, name)
          VALUES (NULL, 'hash', 'Test User');
        `);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('null value');
      }
    });

    it('should enforce unique email constraint', async () => {
      const testEmail = `test_${Date.now()}@example.com`;
      
      // Insert first user
      await pool.query(`
        INSERT INTO users (email, password_hash, name)
        VALUES ($1, 'hash', 'Test User 1');
      `, [testEmail]);

      // Try to insert duplicate
      try {
        await pool.query(`
          INSERT INTO users (email, password_hash, name)
          VALUES ($1, 'hash', 'Test User 2');
        `, [testEmail]);
        fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('duplicate key');
      } finally {
        // Cleanup
        await pool.query('DELETE FROM users WHERE email = $1', [testEmail]);
      }
    });
  });

  describe('Transaction Support', () => {
    it('should support transactions', async () => {
      const client = await pool.connect();
      
      try {
        await client.query('BEGIN');
        
        const result = await client.query('SELECT 1 as value');
        expect(result.rows[0].value).toBe(1);
        
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    });

    it('should rollback on error', async () => {
      const client = await pool.connect();
      const testEmail = `rollback_test_${Date.now()}@example.com`;
      
      try {
        await client.query('BEGIN');
        
        await client.query(`
          INSERT INTO users (email, password_hash, name)
          VALUES ($1, 'hash', 'Test User');
        `, [testEmail]);
        
        // Force an error
        await client.query('SELECT * FROM non_existent_table');
        
        await client.query('COMMIT');
        fail('Should have thrown an error');
      } catch (error) {
        await client.query('ROLLBACK');
        
        // Verify rollback worked
        const result = await pool.query(
          'SELECT * FROM users WHERE email = $1',
          [testEmail]
        );
        expect(result.rows.length).toBe(0);
      } finally {
        client.release();
      }
    });
  });
});
