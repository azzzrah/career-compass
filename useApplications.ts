import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ApplicationStatus = 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';

export interface Application {
  id: string;
  user_id: string;
  job_id: string;
  status: ApplicationStatus;
  applied_at: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location: string | null;
  };
}

export function useApplications() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          job:jobs(id, title, company, location)
        `)
        .eq('user_id', user.id)
        .order('applied_at', { ascending: false });

      if (error) throw error;
      return data as Application[];
    },
    enabled: !!user,
  });
}

export function useCreateApplication() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (jobId: string) => {
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('applications')
        .insert({
          user_id: user.id,
          job_id: jobId,
          status: 'Applied',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: ApplicationStatus }) => {
      const { data, error } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
  });
}
