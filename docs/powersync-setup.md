# PowerSync Setup Guide for ExperimentAI

This guide explains how to configure PowerSync Sync Streams for ExperimentAI.

## Prerequisites

1. Supabase project with the schema from `supabase/schema.sql` applied
2. PowerSync account (sign up at https://powersync.com)

## Step 1: Create PowerSync Instance

1. Log in to PowerSync Dashboard
2. Click "Create Instance"
3. Choose your deployment region
4. Note your PowerSync instance URL

## Step 2: Connect to Supabase

1. In PowerSync Dashboard, go to "Connections"
2. Click "Add Connection"
3. Select "Supabase" as the database type
4. Enter your Supabase connection details:
   - **Host**: Your Supabase database host (from Supabase project settings)
   - **Port**: 5432
   - **Database**: postgres
   - **Username**: postgres
   - **Password**: Your Supabase database password

## Step 3: Configure Sync Streams

PowerSync uses Sync Streams to define which data syncs to clients. Create the following sync rules:

### Sync Rules Configuration

```yaml
# sync-rules.yaml

bucket_definitions:
  user_data:
    parameters:
      - user_id
    data:
      - SELECT * FROM experiments WHERE user_id = token_parameters.user_id
      - SELECT * FROM experiment_analyses WHERE experiment_id IN (SELECT id FROM experiments WHERE user_id = token_parameters.user_id)
      - SELECT * FROM notebook_entries WHERE user_id = token_parameters.user_id
      - SELECT * FROM ai_conversations WHERE user_id = token_parameters.user_id
      
  shared_sessions:
    parameters:
      - user_id
    data:
      - SELECT * FROM experiment_sessions WHERE owner_id = token_parameters.user_id OR id IN (SELECT session_id FROM session_participants WHERE user_id = token_parameters.user_id)
      - SELECT * FROM session_participants WHERE session_id IN (SELECT id FROM experiment_sessions WHERE owner_id = token_parameters.user_id OR id IN (SELECT session_id FROM session_participants WHERE user_id = token_parameters.user_id))
```

### Apply Sync Rules

1. In PowerSync Dashboard, go to "Sync Rules"
2. Paste the sync rules configuration above
3. Click "Deploy"
4. Wait for deployment to complete

## Step 4: Configure JWT Authentication

PowerSync uses JWT tokens from Supabase for authentication.

1. In PowerSync Dashboard, go to "Authentication"
2. Select "Supabase" as the authentication provider
3. Enter your Supabase JWT secret (from Supabase project settings → API → JWT Secret)
4. Configure token parameters:
   ```json
   {
     "user_id": "{{ user.id }}"
   }
   ```

## Step 5: Update Environment Variables

Add your PowerSync instance URL to `.env`:

```env
VITE_POWERSYNC_URL=https://your-instance.powersync.com
```

## Step 6: Test Connection

1. Start your development server: `npm run dev`
2. Sign in to the application
3. Check browser console for "PowerSync initialized successfully"
4. Look for the sync status indicator in the navbar (green dot = connected)

## Sync Behavior

### What Syncs

- **Experiments**: All experiments created by the user
- **Analyses**: AI-generated analyses for user's experiments
- **Notebook Entries**: Lab notebook records
- **Sessions**: Collaborative experiment sessions (owned or participated)
- **Conversations**: AI assistant chat history

### Offline Mode

When offline:
- All experiments continue to work
- Data is stored in local SQLite
- Changes are queued for upload
- UI shows "Offline" status

When connection returns:
- PowerSync automatically syncs queued changes
- UI shows "Syncing..." then "Synced"
- Data is reconciled with server

### Conflict Resolution

PowerSync handles conflicts automatically using last-write-wins strategy. For ExperimentAI:
- Experiment data conflicts are rare (single-user experiments)
- Collaborative sessions use real-time sync to prevent conflicts
- Notebook entries are append-only (no conflicts)

## Monitoring

### PowerSync Dashboard

Monitor sync activity in PowerSync Dashboard:
- Active connections
- Sync throughput
- Error logs
- Performance metrics

### Client-Side Monitoring

Check sync status in the application:
```javascript
import { usePowerSync } from './context/PowerSyncContext';

const { isConnected, isSyncing } = usePowerSync();
console.log('Connected:', isConnected);
console.log('Syncing:', isSyncing);
```

## Troubleshooting

### Connection Issues

**Problem**: PowerSync won't connect

**Solutions**:
1. Verify PowerSync URL in `.env`
2. Check Supabase authentication is working
3. Ensure JWT token is valid
4. Check browser console for errors

### Sync Not Working

**Problem**: Data not syncing between devices

**Solutions**:
1. Verify sync rules are deployed
2. Check user is authenticated
3. Ensure RLS policies allow access
4. Review PowerSync Dashboard logs

### Performance Issues

**Problem**: Slow sync or high latency

**Solutions**:
1. Reduce sync frequency if needed
2. Optimize database queries
3. Add indexes to frequently queried columns
4. Consider pagination for large datasets

## Advanced Configuration

### Custom Sync Rules

Modify sync rules for specific use cases:

```yaml
# Example: Sync only recent experiments
data:
  - SELECT * FROM experiments 
    WHERE user_id = token_parameters.user_id 
    AND created_at > NOW() - INTERVAL '30 days'
```

### Batch Operations

For bulk data operations, use PowerSync batch API:

```javascript
await db.writeTransaction(async (tx) => {
  for (const experiment of experiments) {
    await tx.execute(
      'INSERT INTO experiments (...) VALUES (...)',
      [...]
    );
  }
});
```

## Security Considerations

1. **Row Level Security**: Ensure Supabase RLS policies are properly configured
2. **JWT Tokens**: Never expose JWT secrets in client code
3. **API Keys**: Store API keys in environment variables only
4. **Data Validation**: Validate data before syncing to prevent injection attacks

## Support

For PowerSync-specific issues:
- Documentation: https://docs.powersync.com
- Discord: https://discord.gg/powersync
- Email: support@powersync.com

For ExperimentAI issues:
- GitHub Issues: [Your repo URL]
- Email: [Your email]
