'use client';

import type { HistoryItem } from '@/lib/types';
import { explainProblemAction, improveExplanationAction } from '@/app/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { BrainCircuit, History, Loader2, Send, Trash2, WandSparkles } from 'lucide-react';
import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { useFormStatus } from 'react-dom';

const LOCAL_STORAGE_KEY = 'math-buddy-history';

export function MathBuddy() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isHistoryLoaded, setIsHistoryLoaded] = useState(false);
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  const [state, formAction] = useActionState(explainProblemAction, {});

  const activeItem = history.find(item => item.id === activeId);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedHistory) {
        const parsedHistory = JSON.parse(storedHistory);
        setHistory(parsedHistory);
        if (parsedHistory.length > 0) {
          setActiveId(parsedHistory[0].id);
        }
      }
    } catch (error) {
      console.error('Failed to load history from localStorage', error);
      toast({
        variant: 'destructive',
        title: 'Could not load history',
        description: 'Your previous sessions could not be loaded from local storage.',
      });
    }
    setIsHistoryLoaded(true);
  }, [toast]);

  useEffect(() => {
    if (isHistoryLoaded) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(history));
      } catch (error) {
        console.error('Failed to save history to localStorage', error);
      }
    }
  }, [history, isHistoryLoaded]);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
    if (state.id && state.problem && state.explanation && state.topic) {
      const newItem: HistoryItem = {
        id: state.id,
        problem: state.problem,
        explanation: state.explanation,
        topic: state.topic,
      };
      setHistory(prev => [newItem, ...prev]);
      setActiveId(newItem.id);
      formRef.current?.reset();
    }
  }, [state, toast]);

  const handleSelectHistory = (id: string) => {
    setActiveId(id);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setActiveId(null);
  };

  return (
    <SidebarProvider>
      <Sidebar side="left" className="transition-all duration-300">
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <History className="size-5" />
            <h2 className="text-lg font-semibold">History</h2>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          {isHistoryLoaded && history.length > 0 ? (
            <SidebarMenu>
              {history.map(item => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => handleSelectHistory(item.id)}
                    isActive={item.id === activeId}
                    className="h-auto py-2 text-left"
                  >
                    <span className="truncate">{item.problem}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          ) : (
            <div className="p-2 text-sm text-muted-foreground">
              {isHistoryLoaded ? 'No history yet.' : 'Loading history...'}
            </div>
          )}
        </SidebarContent>
        <SidebarFooter>
          {history.length > 0 && (
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleClearHistory}>
              <Trash2 className="size-4" />
              Clear History
            </Button>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center">
          <div className="w-full max-w-3xl space-y-8">
            <header className="flex items-center gap-4">
              <div className="bg-primary text-primary-foreground rounded-lg p-3">
                <BrainCircuit className="size-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold font-headline">Math Buddy</h1>
                <p className="text-muted-foreground">Your personal AI math tutor</p>
              </div>
              <div className="md:hidden ml-auto">
                <SidebarTrigger />
              </div>
            </header>

            <Card className="shadow-lg">
              <form action={formAction} ref={formRef} key={state.key}>
                <CardContent className="p-6">
                  <Textarea
                    name="problem"
                    placeholder="Enter a math problem, e.g., 'What is the integral of 2x from 0 to 5?'"
                    className="min-h-[100px] w-full resize-none font-code text-base"
                    required
                    defaultValue={activeItem?.problem}
                  />
                </CardContent>
                <CardFooter className="flex justify-end border-t px-6 py-4">
                  <SubmitButton />
                </CardFooter>
              </form>
            </Card>

            <ResultDisplay activeItem={activeItem} setHistory={setHistory} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Solving...
        </>
      ) : (
        <>
          <Send className="mr-2 h-4 w-4" />
          Solve Problem
        </>
      )}
    </Button>
  );
}

function ResultDisplay({
  activeItem,
  setHistory,
}: {
  activeItem: HistoryItem | undefined;
  setHistory: React.Dispatch<React.SetStateAction<HistoryItem[]>>;
}) {
  const { pending } = useFormStatus();
  const [isImproving, startImproveTransition] = useTransition();
  const { toast } = useToast();

  const handleImprove = () => {
    if (!activeItem) return;
    startImproveTransition(async () => {
      const result = await improveExplanationAction(activeItem);
      if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
      } else if (result.updatedExplanation) {
        setHistory(prev =>
          prev.map(item =>
            item.id === activeItem.id
              ? { ...item, explanation: result.updatedExplanation! }
              : item
          )
        );
        toast({ title: 'Explanation Improved!', description: 'The explanation has been updated with a new version.' });
      }
    });
  };

  if (pending) {
    return (
      <Card className="shadow-lg animate-in fade-in duration-500">
        <CardHeader>
          <Skeleton className="h-8 w-1/3" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </CardContent>
      </Card>
    );
  }

  if (!activeItem) {
    return (
      <div className="text-center text-muted-foreground py-10">
        <p>Your solution will appear here.</p>
      </div>
    );
  }

  return (
    <Card className="shadow-lg animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Solution</span>
          <Badge variant="secondary">{activeItem.topic}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="font-code text-sm whitespace-pre-wrap leading-relaxed">
          {activeItem.explanation}
        </pre>
      </CardContent>
      <CardFooter className="flex justify-end border-t px-6 py-4">
        <Button variant="outline" onClick={handleImprove} disabled={isImproving}>
          {isImproving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <WandSparkles className="mr-2 h-4 w-4" />
              Improve this explanation
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
