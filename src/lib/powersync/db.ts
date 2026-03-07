import { PowerSyncDatabase } from '@journeyapps/powersync-sdk-web';
import { AppSchema } from './schema';
import { supabase } from '../supabaseClient';

// PowerSync backend connector for Supabase
class SupabaseConnector {
  async fetchCredentials() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session || error) {
      throw new Error('No active session');
    }

    return {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      token: session.access_token
    };
  }

  async uploadData(database) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    try {
      for (const op of transaction.crud) {
        const { table, op: operation, opData } = op;
        
        if (operation === 'PUT') {
          await supabase.from(table).upsert(opData);
        } else if (operation === 'PATCH') {
          await supabase.from(table).update(opData).eq('id', opData.id);
        } else if (operation === 'DELETE') {
          await supabase.from(table).delete().eq('id', opData.id);
        }
      }
      
      await transaction.complete();
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
}

// Initialize PowerSync database
export const powerSyncDb = new PowerSyncDatabase({
  schema: AppSchema,
  database: {
    dbFilename: 'experimentai.db'
  }
});

const connector = new SupabaseConnector();

// Connect PowerSync to Supabase
export async function initPowerSync() {
  try {
    await powerSyncDb.connect(connector);
    
    // Start upload queue
    powerSyncDb.registerUploadHandler(async () => {
      await connector.uploadData(powerSyncDb);
    });

    console.log('PowerSync initialized successfully');
  } catch (error) {
    console.error('PowerSync initialization failed:', error);
  }
}

// Disconnect PowerSync
export async function disconnectPowerSync() {
  await powerSyncDb.disconnectAndClear();
}
