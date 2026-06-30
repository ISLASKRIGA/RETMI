import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';
import { useAuth } from './useAuth';
import { hospitals as mockHospitals } from '../data/mockData';

type Hospital = Database['public']['Tables']['hospitals']['Row'];

export const useHospitals = () => {
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('hospitals')
        .select('*')
        .eq('status', 'active')
        .order('name');

      if (error) throw error;
      
      let list = data || [];
      if (list.length === 0) {
        list = mockHospitals as any;
      }

      // Automatically associate the user with the hospital that matches the user's ID
      if (user && list.length > 0) {
        const hasMatch = list.some(h => h.user_id === user.id);
        if (!hasMatch) {
          const idMatch = list.some(h => h.id === user.id);
          if (idMatch) {
            list = list.map(h => h.id === user.id ? { ...h, user_id: user.id } : h);
          } else {
            list = list.map((h, i) => i === 0 ? { ...h, user_id: user.id } : h);
          }
        }
      }

      setHospitals(list);
    } catch (err) {
      console.warn("Supabase fetch hospitals failed, using mock data:", err);
      let list = mockHospitals as any;
      
      if (user && list.length > 0) {
        const hasMatch = list.some((h: any) => h.user_id === user.id);
        if (!hasMatch) {
          const idMatch = list.some((h: any) => h.id === user.id);
          if (idMatch) {
            list = list.map((h: any) => h.id === user.id ? { ...h, user_id: user.id } : h);
          } else {
            list = list.map((h: any, i: number) => i === 0 ? { ...h, user_id: user.id } : h);
          }
        }
      }
      
      setHospitals(list);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitals();
  }, [user]); // Re-run when user changes to apply association

  const createHospital = async (hospitalData: Database['public']['Tables']['hospitals']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .insert([hospitalData])
        .select()
        .single();

      if (error) throw error;
      await fetchHospitals(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error creating hospital' };
    }
  };

  const updateHospital = async (id: string, updates: Database['public']['Tables']['hospitals']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('hospitals')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchHospitals(); // Refresh the list
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error updating hospital' };
    }
  };

  return {
    hospitals,
    loading,
    error,
    createHospital,
    updateHospital,
    refetch: fetchHospitals,
  };
};