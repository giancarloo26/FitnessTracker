import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function Login() {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-secondary to-primary">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-heading text-dark mb-2">FitPlan</h1>
          <p className="text-gray-600">Crie e gerencie seus treinos</p>
        </div>
        
        <div className="mb-6">
          <a href="/api/login">
            <Button className="w-full bg-dark hover:bg-opacity-90 transition-all duration-300 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2">
              <UserRound className="h-5 w-5" />
              <span>Entrar</span>
            </Button>
          </a>
        </div>
        
        <img 
          src="https://images.unsplash.com/photo-1571019613914-85f342c6a11e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500" 
          alt="Pessoa se alongando antes do exercício" 
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        
        <p className="text-center text-gray-500 text-sm mt-2">Monte seus treinos personalizados e acompanhe seu progresso</p>
      </div>
    </div>
  );
}
