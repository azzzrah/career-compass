import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  skill_tag: string;
  title: string;
  provider: string | null;
  url: string | null;
}

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*');

      if (error) throw error;
      return data as Course[];
    },
  });
}

export function useCoursesBySkills(skills: string[]) {
  return useQuery({
    queryKey: ['courses', skills],
    queryFn: async () => {
      if (skills.length === 0) return [];
      
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .in('skill_tag', skills);

      if (error) throw error;
      return data as Course[];
    },
    enabled: skills.length > 0,
  });
}
