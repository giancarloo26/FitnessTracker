import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layouts/navbar";
import { WorkoutCard } from "@/components/workouts/workoutCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Workout } from "@shared/schema";

export default function MyWorkouts() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("my-workouts");
  
  const { data: workouts, isLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts", { userId: user?.id }],
    enabled: !!user
  });
  
  const { data: favoriteWorkouts, isLoading: favoritesLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/favorites", { userId: user?.id }],
    enabled: !!user && activeTab === "favorites"
  });
  
  const { data: completedWorkouts, isLoading: completedLoading } = useQuery<Workout[]>({
    queryKey: ["/api/workouts/completed", { userId: user?.id }],
    enabled: !!user && activeTab === "completed"
  });

  return (
    <div className="min-h-screen bg-light">
      <Navbar />
      
      <div className="py-8 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold font-heading text-dark">Meus Treinos</h2>
          <Link href="/workout-editor/new">
            <Button className="bg-primary hover:bg-primary-light transition-all duration-300 text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2">
              <Plus className="h-4 w-4" />
              <span>Novo Treino</span>
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="my-workouts" className="mb-6" onValueChange={setActiveTab}>
          <TabsList className="border-b w-full justify-start space-x-8 rounded-none bg-transparent pb-2">
            <TabsTrigger 
              value="my-workouts" 
              className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 font-medium text-gray-500 data-[state=active]:shadow-none bg-transparent"
            >
              Meus Treinos
            </TabsTrigger>
            <TabsTrigger 
              value="favorites" 
              className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 font-medium text-gray-500 data-[state=active]:shadow-none bg-transparent"
            >
              Favoritos
            </TabsTrigger>
            <TabsTrigger 
              value="completed" 
              className="data-[state=active]:text-primary data-[state=active]:border-b-2 data-[state=active]:border-primary pb-2 font-medium text-gray-500 data-[state=active]:shadow-none bg-transparent"
            >
              Concluídos
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="my-workouts" className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : workouts && workouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="mb-4 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum treino criado</h3>
                <p className="text-gray-600 mb-4">Comece criando seu primeiro treino personalizado</p>
                <Link href="/workout-editor/new">
                  <Button className="bg-primary hover:bg-primary-light text-white">
                    Criar Primeiro Treino
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            {favoritesLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : favoriteWorkouts && favoriteWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">Você ainda não tem treinos favoritos.</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="mt-6">
            {completedLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : completedWorkouts && completedWorkouts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedWorkouts.map((workout) => (
                  <WorkoutCard key={workout.id} workout={workout} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-600">Você ainda não concluiu nenhum treino.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
