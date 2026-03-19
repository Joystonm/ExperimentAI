import { PowerSyncDatabase } from '@powersync/web';
import { AppSchema } from './schema';
import { supabase } from '../supabaseClient';

// PowerSync backend connector for Supabase
class SupabaseConnector {
  async fetchCredentials() {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (!session || error) {
      console.error('No active session for PowerSync:', error);
      throw new Error('No active session');
    }

    const credentials = {
      endpoint: import.meta.env.VITE_POWERSYNC_URL,
      token: session.access_token
    };
    
    console.log('PowerSync credentials:', { 
      endpoint: credentials.endpoint, 
      tokenLength: credentials.token?.length,
      userId: session.user.id
    });
    
    return credentials;
  }

  async uploadData(database) {
    const transaction = await database.getNextCrudTransaction();
    if (!transaction) return;

    console.log('PowerSync uploading transaction:', transaction);

    try {
      for (const op of transaction.crud) {
        const { table, op: operation, opData } = op;
        
        console.log('Uploading:', { table, operation, opData });
        
        if (operation === 'PUT') {
          const result = await supabase.from(table).upsert(opData, { onConflict: 'id' });
          console.log('Upsert result:', result);
          if (result.error) {
            console.error('Upsert error:', result.error);
          }
        } else if (operation === 'PATCH') {
          const result = await supabase.from(table).update(opData).eq('id', opData.id);
          console.log('Update result:', result);
          if (result.error) {
            console.error('Update error:', result.error);
          }
        } else if (operation === 'DELETE') {
          const result = await supabase.from(table).delete().eq('id', opData.id);
          console.log('Delete result:', result);
          if (result.error) {
            console.error('Delete error:', result.error);
          }
        }
      }
      
      await transaction.complete();
      console.log('Transaction completed successfully');
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
let initialized = false;

// Connect PowerSync to Supabase
export async function initPowerSync() {
  if (initialized) return;
  initialized = true;
  try {
    await powerSyncDb.connect(connector);
    console.log('PowerSync initialized successfully');
    
    // Log sync status
    const status = powerSyncDb.currentStatus;
    console.log('PowerSync status:', status);
    
    // Check what's in the database
    setTimeout(async () => {
      const experiments = await powerSyncDb.getAll('SELECT * FROM experiments');
      const notebooks = await powerSyncDb.getAll('SELECT * FROM notebook_entries');
      console.log('Local experiments:', experiments);
      console.log('Local notebook_entries:', notebooks);
    }, 3000);
    
    // Start continuous upload loop
    startUploadLoop();
  } catch (error) {
    console.error('PowerSync initialization failed:', error);
  }
}

// Continuous upload loop to sync local changes to Supabase
async function startUploadLoop() {
  while (true) {
    try {
      await connector.uploadData(powerSyncDb);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Check every second
    } catch (error) {
      console.error('Upload loop error:', error);
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5s on error
    }
  }
}

// Disconnect PowerSync
export async function disconnectPowerSync() {
  await powerSyncDb.disconnect();
}

export async function clearPowerSync() {
  initialized = false;
  await powerSyncDb.disconnectAndClear();
}
