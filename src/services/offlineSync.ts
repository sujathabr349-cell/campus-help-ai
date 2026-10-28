import { useEffect, useState, useCallback } from 'react';
import { CalendarEvent } from '../types/campus';

export interface OfflineSyncStatus {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncedAt: string | null;
  cachedEventsCount: number;
  syncNow: () => Promise<boolean>;
}

const STORAGE_KEY_SYNC_META = 'campus_offline_sync_meta';
const STORAGE_KEY_CALENDAR_CACHE = 'campus_cached_calendar_events';

export const offlineSyncService = {
  /**
   * Syncs critical academic calendar and emergency campus resources into CacheStorage and LocalStorage
   */
  async syncCriticalData(): Promise<{ success: boolean; eventsCount: number; timestamp: string }> {
    const timestamp = new Date().toISOString();
    let eventsCount = 0;

    try {
      // 1. Fetch and cache academic calendar from server
      const calendarRes = await fetch('/api/calendar', {
        headers: { 'Cache-Control': 'no-cache' },
      });

      if (calendarRes.ok) {
        const calendarData = await calendarRes.json();
        if (calendarData.events && Array.isArray(calendarData.events)) {
          eventsCount = calendarData.events.length;
          // Store in LocalStorage as instant offline fallback
          localStorage.setItem(STORAGE_KEY_CALENDAR_CACHE, JSON.stringify(calendarData.events));
        }

        // Also put in Cache API if available
        if ('caches' in window) {
          try {
            const cache = await caches.open('campus-calendar-cache');
            await cache.put('/api/calendar', calendarRes.clone());
          } catch (e) {
            console.warn('CacheStorage put error:', e);
          }
        }
      }

      // 2. Fetch and cache emergency campus contact info & timings
      try {
        const syncRes = await fetch('/api/campus/sync', {
          headers: { 'Cache-Control': 'no-cache' },
        });
        if (syncRes.ok && 'caches' in window) {
          const syncCache = await caches.open('campus-critical-data-cache');
          await syncCache.put('/api/campus/sync', syncRes.clone());
        }
      } catch (e) {
        console.warn('Campus emergency sync error:', e);
      }

      // Update sync metadata
      const meta = {
        lastSyncedAt: timestamp,
        eventsCount: eventsCount || this.getCachedEvents().length,
      };
      localStorage.setItem(STORAGE_KEY_SYNC_META, JSON.stringify(meta));

      return { success: true, eventsCount: meta.eventsCount, timestamp };
    } catch (err) {
      console.warn('Offline sync background network notice (using cached data):', err);
      const existing = this.getCachedEvents();
      return { success: false, eventsCount: existing.length, timestamp: this.getLastSyncedAt() || timestamp };
    }
  },

  /**
   * Retrieves offline cached calendar events
   */
  getCachedEvents(): CalendarEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CALENDAR_CACHE);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse cached calendar events', e);
    }
    return [];
  },

  /**
   * Get timestamp of the last successful sync
   */
  getLastSyncedAt(): string | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_SYNC_META);
      if (raw) {
        const meta = JSON.parse(raw);
        return meta.lastSyncedAt || null;
      }
    } catch {
      return null;
    }
    return null;
  },
};

/**
 * React hook to observe online/offline status and control offline sync
 */
export function useOfflineStatus(): OfflineSyncStatus {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(() =>
    offlineSyncService.getLastSyncedAt()
  );
  const [cachedEventsCount, setCachedEventsCount] = useState<number>(() =>
    offlineSyncService.getCachedEvents().length
  );

  const performSync = useCallback(async (): Promise<boolean> => {
    setIsSyncing(true);
    try {
      const result = await offlineSyncService.syncCriticalData();
      setLastSyncedAt(result.timestamp);
      setCachedEventsCount(result.eventsCount);
      return result.success;
    } catch {
      return false;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Auto-sync fresh calendar data whenever student reconnects to network
      performSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial background sync on mount if online
    if (navigator.onLine) {
      performSync();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [performSync]);

  return {
    isOnline,
    isSyncing,
    lastSyncedAt,
    cachedEventsCount,
    syncNow: performSync,
  };
}
