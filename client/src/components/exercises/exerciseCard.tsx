import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Exercise } from "@shared/schema";

interface ExerciseCardProps {
  exercise: Exercise;
  onClick?: () => void;
}

export function ExerciseCard({ exercise, onClick }: ExerciseCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
      <img 
        src={exercise.imageUrl} 
        alt={exercise.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-5">
        <h3 className="font-bold text-dark text-lg mb-1">{exercise.name}</h3>
        <div className="flex items-center gap-1 text-gray-600 text-sm mb-3">
          <Badge className="bg-primary text-white text-xs rounded-full">{exercise.muscleGroup}</Badge>
          <Badge variant="secondary" className="bg-gray-200 text-gray-700 text-xs rounded-full">{exercise.equipment}</Badge>
        </div>
        <p className="text-gray-600 text-sm mb-3">{exercise.description}</p>
        <Button 
          onClick={onClick} 
          variant="link" 
          className="text-primary hover:text-primary-light transition-colors font-medium text-sm p-0"
        >
          Ver detalhes
        </Button>
      </div>
    </div>
  );
}
