import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type UserRole = 
  | "student_founder" 
  | "mentor" 
  | "investor" 
  | "small_business" 
  | "chartered_accountant" 
  | "admin_team" 
  | "freelancer" 
  | "lawyer" 
  | "expert_professional";

export const useUserRole = () => {
  const { user } = useAuth();

  const { data: role, isLoading, error } = useQuery({
    queryKey: ["userRole", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();
      
      if (error) throw error;
      return data?.role as UserRole | null;
    },
    enabled: !!user?.id,
  });

  const getDashboardPath = () => {
    if (!role) return "/";
    
    switch (role) {
      case "student_founder":
        return "/dashboard/student";
      case "mentor":
        return "/dashboard/mentor";
      case "investor":
        return "/dashboard/investor";
      case "small_business":
        return "/dashboard/business";
      case "expert_professional":
      case "chartered_accountant":
      case "lawyer":
        return "/dashboard/expert";
      case "freelancer":
        return "/dashboard/freelancer";
      default:
        return "/";
    }
  };

  return { role, isLoading, error, getDashboardPath };
};
