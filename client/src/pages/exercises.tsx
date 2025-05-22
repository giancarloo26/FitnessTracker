import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layouts/navbar";
import { ExerciseCard } from "@/components/exercises/exerciseCard";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import type { Exercise } from "@shared/schema";

export default function Exercises() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleGroup, setMuscleGroup] = useState("");
  const [equipment, setEquipment] = useState("");
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  
  // Fetch exercises
  const { data: exercises, isLoading } = useQuery<Exercise[]>({
    queryKey: ["/api/exercises", { search: searchTerm, muscleGroup, equipment }],
    enabled: !!user
  });
  
  // Filter muscle groups for dropdown
  const muscleGroups = exercises 
    ? [...new Set(exercises.map(ex => ex.muscleGroup))] 
    : [];
  
  // Filter equipment types for dropdown
  const equipmentTypes = exercises 
    ? [...new Set(exercises.map(ex => ex.equipment))] 
    : [];
  
  // Handle exercise click to show details
  const handleExerciseClick = (exercise: Exercise) => {
    setSelectedExercise(exercise);
  };

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="py-8 container mx-auto px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold font-heading text-dark mb-2">Exercícios</h2>
          <p className="text-gray-600">Biblioteca completa de exercícios para montar seus treinos</p>
        </div>
        
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Buscar exercícios..."
                  className="w-full pl-10 pr-4 py-2"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={muscleGroup} onValueChange={setMuscleGroup}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Grupo Muscular" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {muscleGroups.map((group) => (
                    <SelectItem key={group} value={group}>{group}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={equipment} onValueChange={setEquipment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Equipamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos</SelectItem>
                  {equipmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Exercise Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : exercises && exercises.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises
              .filter(ex => 
                (!searchTerm || ex.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
                (!muscleGroup || ex.muscleGroup === muscleGroup) &&
                (!equipment || ex.equipment === equipment)
              )
              .map((exercise) => (
                <ExerciseCard 
                  key={exercise.id} 
                  exercise={exercise} 
                  onClick={() => handleExerciseClick(exercise)}
                />
              ))
            }
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center">
            <p className="text-gray-600 mb-2">Nenhum exercício encontrado.</p>
            {(searchTerm || muscleGroup || equipment) && (
              <p className="text-gray-500 text-sm">Tente ajustar seus filtros de busca.</p>
            )}
          </div>
        )}
        
        {/* Exercise Detail Dialog */}
        <Dialog open={!!selectedExercise} onOpenChange={() => setSelectedExercise(null)}>
          <DialogContent className="sm:max-w-[600px]">
            {selectedExercise && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedExercise.name}</DialogTitle>
                </DialogHeader>
                <div className="pt-4">
                  <img 
                    src={selectedExercise.imageUrl} 
                    alt={selectedExercise.name} 
                    className="w-full h-64 object-cover rounded-lg mb-4" 
                  />
                  <div className="flex items-center gap-2 mb-4">
                    <span className="bg-primary text-white text-xs py-1 px-3 rounded-full">
                      {selectedExercise.muscleGroup}
                    </span>
                    <span className="bg-gray-200 text-gray-700 text-xs py-1 px-3 rounded-full">
                      {selectedExercise.equipment}
                    </span>
                  </div>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Descrição</h4>
                    <p className="text-gray-600">{selectedExercise.description}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Como fazer</h4>
                    <ol className="list-decimal pl-5 space-y-2 text-gray-600">
                      {selectedExercise.instructions.map((instruction, i) => (
                        <li key={i}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
