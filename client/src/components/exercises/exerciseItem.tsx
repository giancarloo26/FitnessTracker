import { Button } from "@/components/ui/button";
import { Edit, Trash2, GripVertical } from "lucide-react";
import type { WorkoutExercise } from "@shared/schema";

interface ExerciseItemProps {
  exercise: WorkoutExercise;
  index: number;
  onEdit?: (exercise: WorkoutExercise) => void;
  onDelete?: (exercise: WorkoutExercise) => void;
}

export function ExerciseItem({ exercise, index, onEdit, onDelete }: ExerciseItemProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 w-10 h-10 rounded-lg flex items-center justify-center text-gray-500 font-bold">
            {index + 1}
          </div>
          <div>
            <h4 className="font-medium text-dark">{exercise.name}</h4>
            <p className="text-gray-600 text-sm">{exercise.sets} séries x {exercise.reps} repetições</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
            <GripVertical className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-primary"
            onClick={() => onEdit && onEdit(exercise)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-red-500"
            onClick={() => onDelete && onDelete(exercise)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="pl-14">
        <p className="text-gray-600 text-sm"><span className="font-medium">Descanso:</span> {exercise.restTime} segundos</p>
        {exercise.notes && (
          <p className="text-gray-600 text-sm"><span className="font-medium">Observações:</span> {exercise.notes}</p>
        )}
      </div>
    </div>
  );
}
