'use client';

import { BrainCircuit } from 'lucide-react';

export function OpeningAnimation() {
  return (
    <main className="flex h-screen w-screen items-center justify-center bg-background animate-fade-out [animation-delay:1.5s]">
      <div className="flex flex-col items-center gap-6 text-center animate-flip-in">
        <div className="rounded-full bg-primary p-6 text-primary-foreground">
          <BrainCircuit className="size-20" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-5xl font-bold tracking-tight font-headline">Math Buddy</h1>
          <p className="text-lg text-muted-foreground">Your personal AI math tutor</p>
        </div>
      </div>
    </main>
  );
}
