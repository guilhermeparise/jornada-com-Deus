import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { getLocalDateKey } from '@/lib/devotional-dates';

export function useDevotionalProgress(userId: string | undefined) {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProgress = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("devotional_entries")
        .select("devotional_date")
        .eq("user_id", userId)
        .eq("completed", true);

      if (error) throw error;

      const dailyDates = (data || []).map((row) => row.devotional_date);
      setCompletedDates(dailyDates);
    } catch (err) {
      console.error("Erro ao carregar progresso:", err);
      setError("Não foi possível carregar seu progresso.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  return { completedDates, loading, error, refresh: fetchProgress };
}