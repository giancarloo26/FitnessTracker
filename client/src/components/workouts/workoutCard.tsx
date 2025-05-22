import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Workout } from "@shared/schema";

interface WorkoutCardProps {
  workout: Workout;
  showProgress?: boolean;
  showActions?: boolean;
  onClick?: () => void;
  small?: boolean;
}

export function WorkoutCard({ 
  workout, 
  showProgress = true, 
  showActions = true, 
  onClick,
  small = false
}: WorkoutCardProps) {
  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onClick) onClick();
  };

  const percentComplete = workout.progress || 0;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm workout-card transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="relative">
        <img 
          src={workout.imageUrl || "https://images.unsplash.com/photo-1574680096145-d05b474e2155?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=450"} 
          alt={workout.name} 
          className={cn("w-full object-cover", small ? "h-36" : "h-48")}
        />
        {small && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <h4 className="text-white font-bold font-heading text-xl">{workout.name}</h4>
            <p className="text-white text-opacity-90 text-sm">
              {workout.exercises?.length || 0} exercícios • {workout.duration || 0} min
            </p>
          </div>
        )}
      </div>
      
      {!small && (
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-bold text-dark text-lg mb-1">{workout.name}</h3>
              <p className="text-gray-600 text-sm">
                {workout.exercises?.length || 0} exercícios • {workout.duration || 0} min
              </p>
            </div>
            {showActions && (
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">{workout.level || "Iniciante"}</Badge>
              </div>
            )}
          </div>
          
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progresso: {percentComplete}%</span>
              </div>
              <Progress value={percentComplete} className="h-2" />
            </div>
          )}
          
          {showActions && (
            <div className="flex items-center gap-2">
              <Button 
                className="flex-1 bg-primary hover:bg-primary-light text-white"
                onClick={handleStartClick}
              >
                Iniciar
              </Button>
              <Link href={`/workout-editor/${workout.id}`}>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
