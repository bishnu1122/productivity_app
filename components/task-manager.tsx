"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Task {
  id: number;
  user_name: string;
  description: string;
  completed: boolean;
  duration: number;
  due_date: string;
  created_at: string;
}

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [duration, setDuration] = useState('30');
  const [loading, setLoading] = useState(true);
  const { userName } = useUserStore();

  useEffect(() => {
    fetchTasks();
  }, [userName]);

  const fetchTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_name', userName)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      toast.error('Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    if (!duration || isNaN(Number(duration)) || Number(duration) <= 0) {
      toast.error('Please enter a valid duration');
      return;
    }

    try {
      const { error } = await supabase.from('tasks').insert([
        {
          user_name: userName,
          description: newTask.trim(),
          completed: false,
          duration: Number(duration),
          due_date: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      
      setNewTask('');
      setDuration('30');
      fetchTasks();
      toast.success('Task added successfully');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (taskId: number, completed: boolean) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ completed })
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, completed } : task
      ));
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <form onSubmit={addTask} className="flex gap-2">
        <div className="flex-1 flex gap-2">
          <Input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1"
          />
          <div className="flex items-center gap-2 w-32">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Minutes"
              className="w-20"
              min="1"
            />
          </div>
        </div>
        <Button type="submit">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </form>

      <div className="space-y-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={task.completed}
                  onCheckedChange={(checked) => toggleTask(task.id, checked as boolean)}
                />
                <div className={task.completed ? 'line-through text-muted-foreground' : ''}>
                  <div>{task.description}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {formatDuration(task.duration)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {format(new Date(task.created_at), 'MMM d, yyyy')}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTask(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}