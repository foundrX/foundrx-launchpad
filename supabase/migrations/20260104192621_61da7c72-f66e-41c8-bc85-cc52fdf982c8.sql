-- Fix security issues: Add admin access to applications and proper profile visibility

-- 1. Create a security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_roles.user_id = is_admin.user_id
    AND role = 'admin_team'
  )
$$;

-- 2. Add policy for admins to view all applications
CREATE POLICY "Admins can view all applications"
ON public.applications
FOR SELECT
USING (public.is_admin(auth.uid()));

-- 3. Add policy for admins to update application status
CREATE POLICY "Admins can update applications"
ON public.applications
FOR UPDATE
USING (public.is_admin(auth.uid()));

-- 4. Add policy for authenticated users to view public profile info of others
-- This allows users to see profiles of idea creators and collaborators
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
USING (auth.role() = 'authenticated');

-- 5. Create idea_views table to track unique views and prevent manipulation
CREATE TABLE IF NOT EXISTS public.idea_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  idea_id UUID NOT NULL REFERENCES public.ideas(id) ON DELETE CASCADE,
  user_id UUID,
  session_id TEXT,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(idea_id, user_id, session_id)
);

-- Enable RLS on idea_views
ALTER TABLE public.idea_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert their view (for tracking)
CREATE POLICY "Anyone can insert views"
ON public.idea_views
FOR INSERT
WITH CHECK (true);

-- Only allow viewing own views
CREATE POLICY "Users can view own views"
ON public.idea_views
FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);