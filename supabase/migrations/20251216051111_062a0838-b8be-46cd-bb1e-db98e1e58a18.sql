-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('student_founder', 'mentor', 'investor', 'small_business', 'chartered_accountant', 'admin_team', 'freelancer');

-- Create user_roles table for role management
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role user_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own roles" ON public.user_roles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create workshops table
CREATE TABLE public.workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  host_name TEXT NOT NULL,
  host_title TEXT,
  host_company TEXT,
  host_image_url TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  max_participants INTEGER DEFAULT 50,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view workshops" ON public.workshops
  FOR SELECT USING (true);

-- Create workshop registrations table
CREATE TABLE public.workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID REFERENCES public.workshops(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (workshop_id, user_id)
);

ALTER TABLE public.workshop_registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own registrations" ON public.workshop_registrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register for workshops" ON public.workshop_registrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can cancel their registrations" ON public.workshop_registrations
  FOR DELETE USING (auth.uid() = user_id);

-- Create reviews/testimonials table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT,
  content TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view reviews" ON public.reviews
  FOR SELECT USING (true);

-- Insert sample workshops
INSERT INTO public.workshops (title, description, host_name, host_title, host_company, date, duration_minutes, category) VALUES
('Startup Basics 101', 'Learn the fundamentals of starting your own business from scratch. Perfect for beginners!', 'Rajesh Kumar', 'Serial Entrepreneur', 'TechStart India', now() + interval '7 days', 90, 'Startup Basics'),
('Pitching to Investors', 'Master the art of pitching your ideas to potential investors and secure funding.', 'Priya Sharma', 'Venture Capitalist', 'Sequoia Capital', now() + interval '14 days', 120, 'Pitching & Public Speaking'),
('Marketing on Zero Budget', 'Creative marketing strategies that cost nothing but deliver big results.', 'Amit Patel', 'Marketing Director', 'GrowthHackers', now() + interval '21 days', 90, 'Marketing & Design'),
('Financial Literacy for Founders', 'Understanding finance, accounting, and tax basics every founder should know.', 'Neha Gupta', 'Chartered Accountant', 'EY India', now() + interval '28 days', 120, 'Finance'),
('Building Sustainable Businesses', 'How to create businesses that are both profitable and environmentally friendly.', 'Vikram Singh', 'Sustainability Expert', 'EcoVentures', now() + interval '35 days', 90, 'Eco-Friendly Business');

-- Insert sample reviews
INSERT INTO public.reviews (name, role, content, rating) VALUES
('Aryan Mehta', 'Student Founder', 'FoundrX helped me turn my science project into an actual business. The mentors are amazing!', 5),
('Sneha Reddy', 'Young Entrepreneur', 'The workshops are super practical. I learned more here than in any business class!', 5),
('Rohan Desai', '9th Grade Student', 'Finally, a platform that takes young entrepreneurs seriously. Love the community!', 5),
('Ananya Iyer', 'Freelancer', 'FoundrX connected me with my first paying clients. Forever grateful!', 5),
('Karan Joshi', 'Student Founder', 'The mentorship program changed everything for me. Highly recommend!', 5);

-- Add triggers for updated_at
CREATE TRIGGER update_workshops_updated_at
  BEFORE UPDATE ON public.workshops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();