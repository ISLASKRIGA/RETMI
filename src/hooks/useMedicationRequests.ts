import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications'; // 👈 asegúrate de que la ruta sea correcta
import { supabase } from '../lib/supabase';
import { Database } from '../lib/supabase';
import { medicationRequests as mockRequests, hospitals as mockHospitals } from '../data/mockData';

type MedicationRequest = Database['public']['Tables']['medication_requests']['Row'] & {
  hospitals: Database['public']['Tables']['hospitals']['Row'];
};

export const useMedicationRequests = () => {
  const [requests, setRequests] = useState<MedicationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { refreshNotifications } = useNotifications();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('medication_requests')
        .select(`
          *,
          hospitals (
            id,
            name,
            city,
            state,
            phone,
            email,
            director
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      let list = data || [];
      if (list.length === 0) {
        // Map mock requests format to db type
        list = mockRequests.map(r => ({
          id: r.id,
          hospital_id: r.hospitalId,
          medication_id: r.id, // placeholder
          quantity_requested: r.quantityRequested,
          urgency: r.urgency,
          reason: r.reason,
          contact_person: r.contactPerson,
          contact_phone: r.contactPhone,
          contact_email: r.contactEmail,
          date_needed: r.dateNeeded,
          status: r.status as any,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          hospitals: {
            id: r.hospitalId,
            name: r.hospitalName,
            city: 'Ciudad de México',
            state: 'CDMX',
            phone: r.contactPhone,
            email: r.contactEmail,
            director: mockHospitals.find(h => h.id === r.hospitalId)?.director || 'Director General',
            beds: 100,
            type: 'public',
            specialties: [],
            status: 'active',
            verified: true,
            user_id: '',
            created_at: '',
            updated_at: ''
          }
        })) as any;
      }
      setRequests(list || []);
    } catch (err) {
      console.warn("Supabase fetch requests failed, using mock data:", err);
      const list = mockRequests.map(r => ({
        id: r.id,
        hospital_id: r.hospitalId,
        medication_id: r.id,
        quantity_requested: r.quantityRequested,
        urgency: r.urgency,
        reason: r.reason,
        contact_person: r.contactPerson,
        contact_phone: r.contactPhone,
        contact_email: r.contactEmail,
        date_needed: r.dateNeeded,
        status: r.status as any,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        hospitals: {
          id: r.hospitalId,
          name: r.hospitalName,
          city: 'Ciudad de México',
          state: 'CDMX',
          phone: r.contactPhone,
          email: r.contactEmail,
          director: mockHospitals.find(h => h.id === r.hospitalId)?.director || 'Director General',
          beds: 100,
          type: 'public',
          specialties: [],
          status: 'active',
          verified: true,
          user_id: '',
          created_at: '',
          updated_at: ''
        }
      })) as any;
      setRequests(list);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchRequests();
  }, []);

 const createRequest = async (requestData: Database['public']['Tables']['medication_requests']['Insert']) => {
  try {
    const { data, error } = await supabase
      .from('medication_requests')
      .insert([requestData])
      .select()
      .single();

    if (error) throw error;

   refreshNotifications();


    setTimeout(fetchRequests, 500);
    return { data, error: null };
  } catch (err) {
    return { data: null, error: err instanceof Error ? err.message : 'Error creating request' };
  }
};

    
  const updateRequest = async (id: string, updates: Database['public']['Tables']['medication_requests']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('medication_requests')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      await fetchRequests();
      return { data, error: null };
    } catch (err) {
      return { data: null, error: err instanceof Error ? err.message : 'Error updating request' };
    }
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
    refetch: fetchRequests,
  };
};
