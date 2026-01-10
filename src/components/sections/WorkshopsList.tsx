import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Calendar, Clock, ArrowRight, User } from "lucide-react";
import { format } from "date-fns";
import { WorkshopsGridSkeleton } from "@/components/skeletons/PageSkeletons";

interface Workshop {
  id: string;
  title: string;
  description: string;
  host_name: string;
  host_title: string | null;
  host_company: string | null;
  date: string;
  duration_minutes: number | null;
  category: string | null;
}

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data } = await supabase
        .from("workshops")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(6);

      if (data) setWorkshops(data);
      setLoading(false);
    };

    fetchWorkshops();
  }, []);

  return (
    <section className="py-20 md:py-32 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full gradient-primary opacity-5 blur-3xl" />

      <div className="container relative z-10 px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <GraduationCap className="w-4 h-4 text-accent-foreground" />
            <span className="text-sm font-medium">Upcoming Workshops</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Learn From <span className="text-gradient">Industry Experts</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join interactive workshops led by successful entrepreneurs, investors, and professionals who want to help you succeed.
          </p>
        </div>

        {loading ? (
          <WorkshopsGridSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workshops.map((workshop) => (
              <Link key={workshop.id} to={`/workshop/${workshop.id}`}>
                <Card className="h-full bg-card border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 group cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    {workshop.category && (
                      <span className="inline-block self-start px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                        {workshop.category}
                      </span>
                    )}

                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {workshop.title}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-2">
                      {workshop.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <User className="w-4 h-4 text-primary" />
                        <span>
                          {workshop.host_name}
                          {workshop.host_company && `, ${workshop.host_company}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          <span>{format(new Date(workshop.date), "MMM d")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          <span>{workshop.duration_minutes || 60} min</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-sm font-medium">View Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {workshops.length === 0 && !loading && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No upcoming workshops at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkshopsList;
