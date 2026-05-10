'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export interface Telemetry {
  id: string;
  device_id: string;
  lat: number;
  lng: number;
  timestamp: string;
  is_emergency: boolean;
  audio_buffer?: string | null;
}

export interface SosAlert {
  id: string;
  user_id: string;
  location: { lat: number; lng: number } | null;
  status: string;
  created_at: string;
}

/**
 * Enterprise Realtime Telemetry Hook
 * 
 * Subscribes to live IoT telemetry and SOS alerts using Supabase Realtime.
 */
export function useRealtimeTelemetry(deviceId?: string) {
  const [latestTelemetry, setLatestTelemetry] = useState<Telemetry | null>(null);
  const [activeAlerts, setActiveAlerts] = useState<SosAlert[]>([]);
  const supabase = createClient();

  useEffect(() => {
    // 1. Subscribe to IoT Telemetry
    const telemetryChannel = supabase
      .channel('realtime-telemetry')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'iot_telemetry',
          filter: deviceId ? `device_id=eq.${deviceId}` : undefined,
        },
        (payload) => {
          setLatestTelemetry(payload.new as Telemetry);
        }
      )
      .subscribe();

    // 2. Subscribe to SOS Alerts
    const alertsChannel = supabase
      .channel('realtime-sos')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'sos_alerts',
        },
        (payload) => {
          setActiveAlerts((prev) => [payload.new as SosAlert, ...prev].slice(0, 5));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'sos_alerts',
        },
        (payload) => {
          const updated = payload.new as SosAlert;
          setActiveAlerts((prev) => 
            prev.map((alert) => alert.id === updated.id ? updated : alert)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(telemetryChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, [deviceId, supabase]);

  return { latestTelemetry, activeAlerts };
}
