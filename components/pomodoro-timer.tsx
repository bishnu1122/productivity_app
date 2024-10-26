"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Timer, Play, Pause, RotateCcw } from 'lucide-react';

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [duration, setDuration] = useState(25);
  const { userName } = useUserStore();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleSessionComplete = async () => {
    setIsRunning(false);
    toast.success('Pomodoro session completed!');
    
    try {
      const { error } = await supabase.from('pomodoro_sessions').insert([
        {
          user_name: userName,
          duration: duration * 60,
          completed_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
    } catch (error) {
      toast.error('Failed to save session');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(duration * 60);
  };

  const handleDurationChange = (value: number[]) => {
    const newDuration = value[0];
    setDuration(newDuration);
    setTimeLeft(newDuration * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="p-6 space-y-6">
        <div className="text-center">
          <div className="text-6xl font-bold mb-4 font-mono">
            {formatTime(timeLeft)}
          </div>
          <div className="space-x-2">
            <Button onClick={toggleTimer}>
              {isRunning ? (
                <>
                  <Pause className="h-4 w-4 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Start
                </>
              )}
            </Button>
            <Button variant="outline" onClick={resetTimer}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Duration (minutes): {duration}
            </label>
            <Timer className="h-4 w-4" />
          </div>
          <Slider
            value={[duration]}
            onValueChange={handleDurationChange}
            min={5}
            max={60}
            step={5}
            disabled={isRunning}
          />
        </div>
      </CardContent>
    </Card>
  );
}