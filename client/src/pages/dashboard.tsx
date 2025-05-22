import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layouts/navbar";
import { WorkoutCard } from "@/components/workouts/workoutCard";
import { Button } from "@/components/ui/button";
import { ProgressStats } from "@/components/ui/progress-stats";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { Workout } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading: authLoading } = useAuth();
  
  const { data: nextWorkout, isLoading: workoutLoading } = useQuery<Workout>({
    queryKey: ["/api/workouts/next"],
    enabled: !!user
  });
  
  const { data: popularWorkouts, isLoading: popularLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/popular"],
    enabled: !!user
  });

  const isLoading = authLoading || workoutLoading || popularLoading;
  
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
        <div className="mb-10">
          <h2 className="text-2xl font-bold font-heading text-dark">
            Olá, {user?.firstName || user?.email?.split('@')[0] || 'Atleta'}!
          </h2>
          <p className="text-gray-600">Vamos treinar hoje?</p>
        </div>
        
        {/* Próximo treino */}
        {nextWorkout ? (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-heading">Próximo Treino</h3>
              <span className="text-primary font-medium">Hoje</span>
            </div>
            
            <div className="relative h-48 rounded-lg overflow-hidden mb-4">
              <img 
                src={nextWorkout.imageUrl || "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&h=500"} 
                alt={nextWorkout.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <h4 className="text-white font-bold font-heading text-xl">{nextWorkout.name}</h4>
                <p className="text-white text-opacity-90 text-sm">
                  {nextWorkout.exercises?.length || 0} exercícios • {nextWorkout.duration || 0} min
                </p>
              </div>
            </div>
            
            <Button className="w-full bg-primary hover:bg-primary-light transition-all duration-300 text-white">
              Iniciar Treino
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8 text-center">
            <h3 className="text-lg font-bold font-heading mb-4">Nenhum treino programado</h3>
            <p className="text-gray-600 mb-4">Você ainda não tem treinos criados. Que tal começar agora?</p>
            <Link href="/workout-editor/new">
              <Button className="bg-primary hover:bg-primary-light transition-all duration-300 text-white">
                Criar meu primeiro treino
              </Button>
            </Link>
          </div>
        )}
        
        {/* Resumo semanal */}
        <ProgressStats />
        
        {/* Treinos Populares */}
        <div className="mb-8 mt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-heading">Treinos Populares</h3>
            <Link href="/my-workouts" className="text-primary text-sm font-medium">
              Ver todos
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularWorkouts?.slice(0, 3).map((workout) => (
              <WorkoutCard 
                key={workout.id}
                workout={workout}
                showProgress={false}
                showActions={false}
              />
            ))}
            
            {(!popularWorkouts || popularWorkouts.length === 0) && (
              <div className="col-span-full bg-white rounded-xl p-6 text-center">
                <p className="text-gray-600">Nenhum treino popular disponível no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
