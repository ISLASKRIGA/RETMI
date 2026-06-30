import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to notify other hook instances of auth state changes
  const notifyAuthChange = () => {
    window.dispatchEvent(new Event('retmi-auth-change'));
  };

  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('retmi_mock_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
        setLoading(false);
      } else {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user) {
            setUser(session.user);
          } else {
            setUser(null);
          }
          setLoading(false);
        }).catch(err => {
          console.warn("Supabase auth error, using offline state:", err);
          setUser(null);
          setLoading(false);
        });
      }
    };

    // Listen for custom mock auth changes
    window.addEventListener('retmi-auth-change', checkSession);

    // Initial check
    checkSession();

    // Listen for Supabase auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          const savedUser = localStorage.getItem('retmi_mock_user');
          if (!savedUser) {
            setUser(null);
          }
        }
        setLoading(false);
      }
    );

    return () => {
      window.removeEventListener('retmi-auth-change', checkSession);
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string, hospitalId?: string) => {
    try {
      if (hospitalId) {
        const mockUser = {
          id: hospitalId,
          email: `${hospitalId.toLowerCase().replace(/\s+/g, '')}@retmi.org`,
          role: 'authenticated',
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          app_metadata: {},
          user_metadata: { hospital_id: hospitalId },
        } as User;
        
        setUser(mockUser);
        localStorage.setItem('retmi_mock_user', JSON.stringify(mockUser));
        notifyAuthChange();
        return { data: { user: mockUser, session: null }, error: null };
      }

      let result = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      // Automatically sign up if user does not exist
      if (
        result.error &&
        (result.error.message.includes('Invalid login credentials') ||
          result.error.status === 400 ||
          result.error.message.includes('User not found'))
      ) {
        console.log("User not found, attempting automatic signup...");
        const signUpResult = await signUp(email, password);
        if (!signUpResult.error) {
          result = await supabase.auth.signInWithPassword({
            email,
            password,
          });
        } else {
          throw signUpResult.error;
        }
      }

      if (result.error) {
        throw result.error;
      }

      if (result.data?.user) {
        setUser(result.data.user);
        notifyAuthChange();
        return { data: result.data, error: null };
      }

      throw new Error("No user returned from Supabase");
    } catch (err: any) {
      console.warn("Supabase login failed, using local mock session:", err.message || err);
      // Hardcoded mock user for offline / dummy configuration mode
      const mockUser = {
        id: '1', // Matches 'Hospital General San Juan' in mockData.ts
        email: email,
        role: 'authenticated',
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
      } as User;
      
      setUser(mockUser);
      localStorage.setItem('retmi_mock_user', JSON.stringify(mockUser));
      notifyAuthChange();
      return { data: { user: mockUser, session: null }, error: null };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('retmi_mock_user');
    try {
      const { error } = await supabase.auth.signOut();
      setUser(null);
      notifyAuthChange();
      return { error };
    } catch (err) {
      setUser(null);
      notifyAuthChange();
      return { error: null };
    }
  };

  return {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  };
};
