import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  title: string;
  company: string;
  salary_range: string | null;
  location: string | null;
  source: string | null;
  required_skills: string[];
  description: string | null;
  posted_at: string | null;
}

export function useJobs(sourceFilter?: string) {
  return useQuery({
    queryKey: ['jobs', sourceFilter],
    queryFn: async () => {
      let query = supabase.from('jobs').select('*').order('posted_at', { ascending: false });
      
      if (sourceFilter && sourceFilter !== 'all') {
        query = query.eq('source', sourceFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as Job[];
    },
  });
}

export function useJobSources() {
  return useQuery({
    queryKey: ['job-sources'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('source')
        .not('source', 'is', null);

      if (error) throw error;
      
      const sources = [...new Set(data.map(j => j.source).filter(Boolean))];
      return sources as string[];
    },
  });
}
