'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BrainCircuit, GraduationCap, School, Calculator, ArrowRight } from 'lucide-react';

const standards = [
  {
    level: 'Elementary School',
    description: 'Grades 1-5. Basic arithmetic, fractions, and geometry.',
    icon: <School className="size-8" />,
  },
  {
    level: 'Middle School',
    description: 'Grades 6-8. Pre-algebra, algebra basics, and geometry.',
    icon: <Calculator className="size-8" />,
  },
  {
    level: 'High School',
    description: 'Grades 9-12. Algebra, geometry, trigonometry, and calculus.',
    icon: <GraduationCap className="size-8" />,
  },
];

export function HomePage() {
  return (
    <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col items-center animate-fade-in">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex flex-col items-center text-center gap-4">
          <div className="bg-primary text-primary-foreground rounded-lg p-3">
            <BrainCircuit className="size-10" />
          </div>
          <div>
            <h1 className="text-4xl font-bold font-headline">Welcome to Math Buddy</h1>
            <p className="text-muted-foreground text-lg mt-2">
              Your personal AI math tutor. Select your level to get started.
            </p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {standards.map((standard) => (
            <Card key={standard.level} className="shadow-lg hover:shadow-xl transition-shadow bg-card border-border/50 hover:border-primary/50">
              <CardHeader className="items-center text-center">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  {standard.icon}
                </div>
                <CardTitle>{standard.level}</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>{standard.description}</CardDescription>
                <Button asChild className="mt-6 w-full">
                  <Link href="/solve">
                    Start Solving
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}
