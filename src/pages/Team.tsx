import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

interface TeamMember {
  name: string;
  roles: string[];
  image?: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Sarah",
    roles: ["Founder", "CEO", "Administrative Head", "Social Media Manager", "Marketing"],
  },
  {
    name: "Aannya",
    roles: ["COO", "CFO", "Administrative"],
  },
  {
    name: "Anannya",
    roles: ["CTO", "Administrative", "Marketing"],
  },
  {
    name: "Urvi",
    roles: ["HR", "Marketing Head", "Head Designer"],
  },
];

const Team = () => {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              <Users className="h-3 w-3 mr-1" />
              Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Meet the <span className="text-primary">Team</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              A passionate team of 8th graders dedicated to empowering young entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <Card 
                key={index} 
                className="group hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                      <span className="text-3xl font-bold text-primary">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{member.name}</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                      {member.roles.map((role, roleIndex) => (
                        <Badge 
                          key={roleIndex} 
                          variant="secondary" 
                          className="text-xs"
                        >
                          {role}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default Team;
