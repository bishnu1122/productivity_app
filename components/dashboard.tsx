"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TaskManager from "@/components/task-manager";
import PomodoroTimer from "@/components/pomodoro-timer";
import DailyNotes from "@/components/daily-notes";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/lib/store";
import { LogOut } from "lucide-react";

export default function Dashboard() {
  const { userName, clearUserName } = useUserStore();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={clearUserName}
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="tasks" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="pomodoro">Pomodoro</TabsTrigger>
            <TabsTrigger value="notes">Notes</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-4">
            <TaskManager />
          </TabsContent>

          <TabsContent value="pomodoro" className="space-y-4">
            <PomodoroTimer />
          </TabsContent>

          <TabsContent value="notes" className="space-y-4">
            <DailyNotes />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}