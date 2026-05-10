import { createAdminClient } from '@/utils/supabase/admin';
import { systemLogger } from './logger';

/**
 * Enterprise Audit Logging Utility
 * 
 * Records sensitive administrative actions to the audit_logs table.
 */

export interface AuditLogEntry {
  actor_id?: string;
  action: string;
  entity_type: string;
  entity_id?: string;
  payload?: any;
}

/**
 * Records an audit log entry in Supabase.
 */
export async function recordAuditLog(entry: AuditLogEntry) {
  const supabase = createAdminClient();
  
  try {
    const { error } = await supabase.from('audit_logs').insert({
      actor_id: entry.actor_id,
      action: entry.action,
      entity_type: entry.entity_type,
      entity_id: entry.entity_id,
      payload: entry.payload
    });

    if (error) {
      systemLogger.error('Failed to record audit log', error, entry);
    } else {
      systemLogger.info('Audit log recorded', { action: entry.action, entity: entry.entity_type });
    }
  } catch (err) {
    systemLogger.error('Audit logging exception', err, entry);
  }
}
