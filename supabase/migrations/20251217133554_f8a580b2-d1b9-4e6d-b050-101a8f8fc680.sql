-- Add the new expert_professional role to the enum
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'expert_professional';