-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  current_skills TEXT[] DEFAULT '{}',
  target_role TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  salary_range TEXT,
  location TEXT,
  source TEXT,
  required_skills TEXT[] DEFAULT '{}',
  description TEXT,
  posted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_tag TEXT NOT NULL,
  title TEXT NOT NULL,
  provider TEXT,
  url TEXT
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Applied' CHECK (status IN ('Applied', 'Interviewing', 'Offer', 'Rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Jobs policies (public read for demo)
CREATE POLICY "Anyone can view jobs" ON public.jobs
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert jobs" ON public.jobs
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Courses policies (public read for demo)
CREATE POLICY "Anyone can view courses" ON public.courses
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert courses" ON public.courses
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Applications policies
CREATE POLICY "Users can view their own applications" ON public.applications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own applications" ON public.applications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own applications" ON public.applications
  FOR DELETE USING (auth.uid() = user_id);

-- Create function to handle profile creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for profiles updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();