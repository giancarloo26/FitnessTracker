import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Meus Treinos", href: "/my-workouts" },
    { label: "Exercícios", href: "/exercises" },
    { label: "Perfil", href: "/profile" }
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <h1 className="text-xl font-bold font-heading text-primary">FitPlan</h1>
          
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href}
                className={cn(
                  "text-dark font-medium hover:text-primary transition-colors",
                  location === item.href && "text-primary"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <div className="hidden md:block text-sm font-medium">
                {user?.firstName || user?.email}
              </div>
            )}
            {isAuthenticated && (
              <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden">
                {user?.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl} 
                    alt="Perfil do usuário" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-secondary flex items-center justify-center text-white text-xs">
                    {user?.firstName?.charAt(0) || user?.email?.charAt(0) || '?'}
                  </div>
                )}
              </div>
            )}
            
            <Sheet>
              <SheetTrigger asChild>
                <button className="md:hidden text-dark">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent className="py-6">
                <nav className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "px-2 py-2 text-dark font-medium hover:text-primary transition-colors",
                        location === item.href && "text-primary"
                      )}
                    >
                      {item.label}
                    </Link>
                  ))}
                  {isAuthenticated && (
                    <a 
                      href="/api/logout"
                      className="px-2 py-2 text-dark font-medium hover:text-primary transition-colors"
                    >
                      Sair
                    </a>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
