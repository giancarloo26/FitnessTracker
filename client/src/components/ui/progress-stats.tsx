import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

const DAYS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SAB"];

interface ProgressDay {
  day: string;
  minutes: number;
  isToday: boolean;
}

export function ProgressStats() {
  const [weekData, setWeekData] = useState<ProgressDay[]>([]);
  const [totalTime, setTotalTime] = useState("0h 0min");
  const [completedWorkouts, setCompletedWorkouts] = useState("0/0");

  useEffect(() => {
    // This would normally fetch from an API, but for demo we'll create sample data
    const today = new Date().getDay();
    const mockData: ProgressDay[] = DAYS.map((day, index) => ({
      day,
      minutes: index === today ? 0 : Math.random() > 0.4 ? Math.floor(Math.random() * 60) + 15 : 0,
      isToday: index === today
    }));

    // Calculate total time
    const totalMinutes = mockData.reduce((sum, day) => sum + day.minutes, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    setWeekData(mockData);
    setTotalTime(`${hours}h ${minutes}min`);
    
    // Set completed workouts
    const completed = mockData.filter(day => day.minutes > 0).length;
    const total = 5; // Assume 5 planned workouts per week
    setCompletedWorkouts(`${completed}/${total}`);
  }, []);

  return (
    <Card className="bg-white rounded-xl shadow-sm">
      <CardContent className="p-6">
        <h3 className="text-lg font-bold font-heading mb-4">Resumo Semanal</h3>
        
        <div className="grid grid-cols-7 gap-2 mb-6">
          {weekData.map((data, i) => (
            <div key={i} className="text-center">
              <div className="text-xs text-gray-500 mb-1">{data.day}</div>
              {data.isToday ? (
                <div className="h-14 w-full rounded-md flex items-center justify-center bg-gray-300 text-gray-500 font-medium text-sm">
                  Hoje
                </div>
              ) : data.minutes > 0 ? (
                <div 
                  className={`h-14 w-full rounded-md flex items-center justify-center ${
                    data.minutes >= 45 ? 'bg-primary' : 'bg-primary-light'
                  } text-white font-medium text-sm`}
                >
                  {Math.floor(data.minutes / 60) > 0 ? `${Math.floor(data.minutes / 60)}h` : `${data.minutes}m`}
                </div>
              ) : (
                <div className="h-14 w-full rounded-md flex items-center justify-center bg-gray-200 text-gray-400 font-medium text-sm">
                  0m
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total esta semana</p>
            <p className="text-2xl font-bold font-heading text-dark">{totalTime}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Treinos</p>
            <p className="text-2xl font-bold font-heading text-dark">{completedWorkouts}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
