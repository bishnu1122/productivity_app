"use client";

import { useState, useEffect } from 'react';
import { useUserStore } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Loader2, Sun, Moon } from 'lucide-react';
import { format } from 'date-fns';

interface Note {
  id: number;
  user_name: string;
  content: string;
  type: 'morning' | 'evening';
  created_at: string;
}

export default function DailyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [morningNote, setMorningNote] = useState('');
  const [eveningNote, setEveningNote] = useState('');
  const { userName } = useUserStore();

  useEffect(() => {
    fetchTodayNotes();
  }, [userName]);

  const fetchTodayNotes = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_name', userName)
        .gte('created_at', today)
        .lt('created_at', new Date(new Date().setDate(new Date().getDate() + 1)).toISOString());

      if (error) throw error;

      setNotes(data || []);
      const morning = data?.find(note => note.type === 'morning');
      const evening = data?.find(note => note.type === 'evening');
      
      if (morning) setMorningNote(morning.content);
      if (evening) setEveningNote(evening.content);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const saveNote = async (type: 'morning' | 'evening', content: string) => {
    if (!content.trim()) return;

    try {
      const existingNote = notes.find(note => note.type === type);
      
      if (existingNote) {
        const { error } = await supabase
          .from('notes')
          .update({ content })
          .eq('id', existingNote.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('notes')
          .insert([{
            user_name: userName,
            content,
            type,
          }]);
        
        if (error) throw error;
      }

      toast.success('Note saved successfully');
      fetchTodayNotes();
    } catch (error) {
      toast.error('Failed to save note');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Morning Reflection</CardTitle>
          <Sun className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="What are your goals for today?"
              value={morningNote}
              onChange={(e) => setMorningNote(e.target.value)}
              rows={4}
            />
            <Button onClick={() => saveNote('morning', morningNote)}>
              Save Morning Note
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-medium">Evening Reflection</CardTitle>
          <Moon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="How was your day? What did you accomplish?"
              value={eveningNote}
              onChange={(e) => setEveningNote(e.target.value)}
              rows={4}
            />
            <Button onClick={() => saveNote('evening', eveningNote)}>
              Save Evening Note
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}