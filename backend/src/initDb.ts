import pool from './config/database';

async function initDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Initialisation de la base de données...');

    // Créer la table users
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer l'enum pour les status des tâches
    await client.query(`
      DO $$ BEGIN
        CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    // Créer la table tasks
    await client.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status task_status DEFAULT 'pending',
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Créer des index pour améliorer les performances
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);
    
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
    `);

    // Créer une fonction pour mettre à jour automatiquement updated_at
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    // Créer les triggers pour les mises à jour automatiques
    await client.query(`
      DROP TRIGGER IF EXISTS update_users_updated_at ON users;
      CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await client.query(`
      DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
      CREATE TRIGGER update_tasks_updated_at
        BEFORE UPDATE ON tasks
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    console.log('✅ Base de données initialisée avec succès!');
    
    // Afficher des informations sur les tables créées
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('users', 'tasks')
      ORDER BY table_name;
    `);
    
    console.log('📊 Tables créées:', tablesResult.rows.map(r => r.table_name).join(', '));

  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Exécuter l'initialisation si ce fichier est lancé directement
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Initialisation terminée avec succès!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Échec de l\'initialisation:', error);
      process.exit(1);
    });
}

export default initDatabase;