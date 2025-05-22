import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layouts/navbar";
import { WorkoutForm } from "@/components/workouts/workoutForm";
import { Button } from "@/components/ui/button";
import { ExerciseItem } from "@/components/exercises/exerciseItem";
import { ArrowLeft, File } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams, Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { insertWorkoutExerciseSchema } from "@shared/schema";
import { z } from "zod";
import type { Exercise, Workout, WorkoutExercise } from "@shared/schema";

export default function WorkoutEditor() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const params = useParams();
  const [, setLocation] = useLocation();
  const isNew = params.id === "new";
  const workoutId = !isNew ? params.id : undefined;
  
  const [isExerciseDialogOpen, setIsExerciseDialogOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [exerciseForm, setExerciseForm] = useState({
    sets: 3,
    reps: 12,
    restTime: 60,
    notes: ""
  });
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExercise[]>([]);
  
  // Fetch workout if editing
  const { data: workout, isLoading: workoutLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts", workoutId],
    enabled: !!workoutId && !!user,
  });

  // Fetch exercises for dropdown
  const { data: exercises } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises"],
    enabled: !!user,
  });

  // Fetch workout exercises if editing
  const { data: fetchedWorkoutExercises, isLoading: exercisesLoading } = useQuery<WorkoutExercise[]>({
    queryKey: ["/api/workouts", workoutId, "exercises"],
    enabled: !!workoutId && !!user,
  });

  // Update workout exercises when fetched
  useEffect(() => {
    if (fetchedWorkoutExercises) {
      setWorkoutExercises(fetchedWorkoutExercises);
    }
  }, [fetchedWorkoutExercises]);

  // Create/Update workout mutation
  const { mutate: saveWorkout, isPending: isSaving } = useMutation({
    mutationFn: async (data: z.infer<typeof insertWorkoutExerciseSchema>) => {
      if (isNew) {
        return apiRequest("POST", "/api/workouts", {
          ...data,
          exercises: workoutExercises
        });
      } else {
        return apiRequest("PATCH", `/api/workouts/${workoutId}`, {
          ...data,
          exercises: workoutExercises
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/workouts"] });
      toast({
        title: "Sucesso!",
        description: `Treino ${isNew ? "criado" : "atualizado"} com sucesso.`,
      });
      setLocation("/my-workouts");
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível ${isNew ? "criar" : "atualizar"} o treino: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle adding/editing exercise to workout
  const handleExerciseSubmit = () => {
    if (!selectedExercise) return;
    
    const newExercise: WorkoutExercise = {
      id: editingExerciseId || `temp-${Date.now()}`,
      exerciseId: selectedExercise.id,
      name: selectedExercise.name,
      sets: exerciseForm.sets,
      reps: exerciseForm.reps,
      restTime: exerciseForm.restTime,
      notes: exerciseForm.notes,
      order: editingExerciseId ? workoutExercises.findIndex(e => e.id === editingExerciseId) : workoutExercises.length
    };
    
    if (editingExerciseId) {
      setWorkoutExercises(workoutExercises.map(ex => 
        ex.id === editingExerciseId ? newExercise : ex
      ));
    } else {
      setWorkoutExercises([...workoutExercises, newExercise]);
    }
    
    resetExerciseForm();
    setIsExerciseDialogOpen(false);
  };

  // Handle deleting exercise from workout
  const handleDeleteExercise = (exercise: WorkoutExercise) => {
    setWorkoutExercises(workoutExercises.filter(ex => ex.id !== exercise.id));
    toast({
      description: `"${exercise.name}" removido do treino.`,
    });
  };

  // Handle editing exercise
  const handleEditExercise = (exercise: WorkoutExercise) => {
    const exerciseData = exercises?.find(ex => ex.id === exercise.exerciseId);
    if (exerciseData) {
      setSelectedExercise(exerciseData);
      setExerciseForm({
        sets: exercise.sets,
        reps: exercise.reps,
        restTime: exercise.restTime,
        notes: exercise.notes || ""
      });
      setEditingExerciseId(exercise.id);
      setIsExerciseDialogOpen(true);
    }
  };

  // Reset exercise form
  const resetExerciseForm = () => {
    setSelectedExercise(null);
    setExerciseForm({
      sets: 3,
      reps: 12,
      restTime: 60,
      notes: ""
    });
    setEditingExerciseId(null);
  };

  const isLoading = workoutLoading || exercisesLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-light">
        <Navbar />
        <div className="py-8 container mx-auto px-4">
          <div className="h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="py-8 container mx-auto px-4">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Link href="/my-workouts">
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h2 className="text-2xl font-bold font-heading text-dark">
              {isNew ? "Novo Treino" : `Editar: ${workout?.name}`}
            </h2>
          </div>
          <p className="text-gray-600">
            {isNew ? "Crie seu treino personalizado" : "Atualize os detalhes do seu treino"}
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <WorkoutForm
            initialData={workout}
            onSubmit={saveWorkout}
            isSubmitting={isSaving}
          />
        </div>
        
        {/* Exercise List */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold font-heading">Exercícios</h3>
            <Button 
              onClick={() => {
                resetExerciseForm();
                setIsExerciseDialogOpen(true);
              }}
              variant="link" 
              className="text-primary hover:text-primary-light transition-colors font-medium"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span>Adicionar Exercício</span>
            </Button>
          </div>
          
          {/* Exercise List (Empty State) */}
          {workoutExercises.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="mb-3">
                <File className="h-12 w-12 mx-auto text-gray-400" />
              </div>
              <h4 className="text-gray-700 font-medium mb-2">Nenhum exercício adicionado</h4>
              <p className="text-gray-500 mb-4">Adicione exercícios ao seu treino para começar</p>
              <Button 
                onClick={() => setIsExerciseDialogOpen(true)}
                className="bg-primary hover:bg-primary-light transition-all duration-300 text-white"
              >
                Adicionar Primeiro Exercício
              </Button>
            </div>
          )}
          
          {/* Exercise Items */}
          {workoutExercises.length > 0 && (
            <div className="space-y-4">
              {workoutExercises.map((exercise, index) => (
                <ExerciseItem 
                  key={exercise.id}
                  exercise={exercise}
                  index={index}
                  onEdit={handleEditExercise}
                  onDelete={handleDeleteExercise}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Exercise Dialog */}
      <Dialog open={isExerciseDialogOpen} onOpenChange={setIsExerciseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingExerciseId ? "Editar Exercício" : "Adicionar Exercício"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="exercise">Exercício</Label>
              <Select
                value={selectedExercise?.id}
                onValueChange={(value) => {
                  const exercise = exercises?.find(ex => ex.id === value);
                  if (exercise) {
                    setSelectedExercise(exercise);
                  }
                }}
                disabled={!!editingExerciseId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um exercício" />
                </SelectTrigger>
                <SelectContent>
                  {exercises?.map((exercise) => (
                    <SelectItem key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="sets">Séries</Label>
                <Input
                  id="sets"
                  type="number"
                  value={exerciseForm.sets}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, sets: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reps">Repetições</Label>
                <Input
                  id="reps"
                  type="number"
                  value={exerciseForm.reps}
                  onChange={(e) => setExerciseForm({ ...exerciseForm, reps: parseInt(e.target.value) || 1 })}
                  min={1}
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="restTime">Tempo de Descanso (segundos)</Label>
              <Input
                id="restTime"
                type="number"
                value={exerciseForm.restTime}
                onChange={(e) => setExerciseForm({ ...exerciseForm, restTime: parseInt(e.target.value) || 30 })}
                min={0}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="notes">Observações</Label>
              <Textarea
                id="notes"
                value={exerciseForm.notes}
                onChange={(e) => setExerciseForm({ ...exerciseForm, notes: e.target.value })}
                placeholder="Instruções específicas ou dicas para este exercício"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsExerciseDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              onClick={handleExerciseSubmit}
              disabled={!selectedExercise}
              className="bg-primary hover:bg-primary-light text-white"
            >
              {editingExerciseId ? "Atualizar" : "Adicionar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      {...props}
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
