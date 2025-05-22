import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navbar } from "@/components/layouts/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface UserProfile {
  height?: number;
  weight?: number;
  goal?: string;
  trainingDays?: string[];
}

export default function Profile() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [profile, setProfile] = useState<UserProfile>({
    height: 170,
    weight: 70,
    goal: "hipertrofia",
    trainingDays: ["0", "2", "4", "6"] // Sunday, Tuesday, Thursday, Saturday
  });
  
  // Fetch user profile data
  const { data: profileData, isLoading: profileLoading } = useQuery<UserProfile>({
    queryKey: ["/api/profile", user?.id],
    enabled: !!user?.id,
  });
  
  // Update profile when data is fetched
  useEffect(() => {
    if (profileData) {
      setProfile({
        ...profile,
        ...profileData
      });
    }
  }, [profileData]);
  
  // Update profile mutation
  const { mutate: updateProfile, isPending } = useMutation({
    mutationFn: async (data: UserProfile) => {
      return apiRequest("PATCH", "/api/profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o perfil: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profile);
  };
  
  const isLoading = authLoading || profileLoading;

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
        <div className="mb-8">
          <h2 className="text-2xl font-bold font-heading text-dark mb-2">Perfil</h2>
          <p className="text-gray-600">Gerencie suas informações pessoais e preferências</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* User info header */}
          <div className="bg-gradient-to-r from-secondary to-primary p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="h-24 w-24 rounded-full border-4 border-white overflow-hidden flex-shrink-0">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Perfil do usuário" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-white flex items-center justify-center text-primary text-2xl font-bold">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-white text-2xl font-bold mb-1">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}`
                    : user?.email?.split('@')[0] || 'Usuário'}
                </h3>
                <p className="text-white text-opacity-90 mb-2">{user?.email}</p>
                <p className="text-white text-opacity-80 text-sm">
                  Membro desde {new Date().toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 p-4 gap-4 border-b">
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.floor(Math.random() * 30)}
              </div>
              <div className="text-gray-500 text-sm">Treinos</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.floor(Math.random() * 60)}h
              </div>
              <div className="text-gray-500 text-sm">Tempo Total</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.floor(Math.random() * 20)}
              </div>
              <div className="text-gray-500 text-sm">Dias Ativos</div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.floor(Math.random() * 10)}
              </div>
              <div className="text-gray-500 text-sm">Exercícios Favoritos</div>
            </div>
          </div>
          
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <h4 className="text-lg font-bold font-heading mb-4">Informações Pessoais</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="profile-name" className="block text-gray-700 font-medium mb-2">
                  Nome
                </Label>
                <Input
                  id="profile-name"
                  type="text"
                  value={user?.firstName || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="profile-email" className="block text-gray-700 font-medium mb-2">
                  Email
                </Label>
                <Input
                  id="profile-email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <Label htmlFor="profile-height" className="block text-gray-700 font-medium mb-2">
                  Altura (cm)
                </Label>
                <Input
                  id="profile-height"
                  type="number"
                  value={profile.height}
                  onChange={(e) => setProfile({ ...profile, height: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
              <div>
                <Label htmlFor="profile-weight" className="block text-gray-700 font-medium mb-2">
                  Peso (kg)
                </Label>
                <Input
                  id="profile-weight"
                  type="number"
                  value={profile.weight}
                  onChange={(e) => setProfile({ ...profile, weight: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                />
              </div>
            </div>
            
            <div className="mb-6">
              <Label htmlFor="profile-goal" className="block text-gray-700 font-medium mb-2">
                Objetivo Principal
              </Label>
              <Select
                value={profile.goal}
                onValueChange={(value) => setProfile({ ...profile, goal: value })}
              >
                <SelectTrigger className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
                  <SelectValue placeholder="Selecione seu objetivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hipertrofia">Hipertrofia</SelectItem>
                  <SelectItem value="perda-peso">Perda de Peso</SelectItem>
                  <SelectItem value="condicao-fisica">Melhorar Condição Física</SelectItem>
                  <SelectItem value="resistencia">Aumentar Resistência</SelectItem>
                  <SelectItem value="forca">Ganho de Força</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="mb-6">
              <Label className="block text-gray-700 font-medium mb-2">
                Dias disponíveis para treino
              </Label>
              <ToggleGroup 
                type="multiple" 
                className="grid grid-cols-4 md:grid-cols-7 gap-2"
                value={profile.trainingDays}
                onValueChange={(value) => {
                  if (value.length > 0) {
                    setProfile({ ...profile, trainingDays: value });
                  }
                }}
              >
                {DAYS.map((day, i) => (
                  <ToggleGroupItem 
                    key={i} 
                    value={i.toString()}
                    className="py-2 px-3 rounded-lg data-[state=on]:bg-primary data-[state=on]:text-white data-[state=off]:border data-[state=off]:border-gray-300 data-[state=off]:text-gray-700 font-medium text-center"
                  >
                    {day}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={isPending}
                className="bg-primary hover:bg-primary-light transition-all duration-300 text-white font-medium py-2 px-6 rounded-lg"
              >
                {isPending ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
