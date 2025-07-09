'use client';

import { useState } from 'react';
import type { GrievanceResults } from '@/lib/actions';
import { handleGrievance } from '@/lib/actions';
import { GrievanceForm } from '@/components/grievance-form';
import { ResultsDisplay } from '@/components/results-display';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<GrievanceResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFormSubmit = async ({ grievance }: { grievance: string }) => {
    setIsLoading(true);
    setResults(null);

    const response = await handleGrievance(grievance);

    if (response.error) {
      toast({
        title: 'Error',
        description: response.error,
        variant: 'destructive',
      });
    } else if (response.data) {
      setResults(response.data);
    }
    
    setIsLoading(false);
  };

  return (
    <main className="container mx-auto px-4 py-12 md:py-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
          BetterCallCamp
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          Your AI-powered advocate for resolving common grievances.
        </p>
      </header>

      <div className="space-y-12">
        <GrievanceForm onSubmit={handleFormSubmit} isLoading={isLoading} />
        
        {isLoading && (
          <div className="flex flex-col items-center justify-center text-center gap-4 py-10">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground font-semibold">
              Our AI is on the case...<br />
              Analyzing your situation, please wait a moment.
            </p>
          </div>
        )}

        {results && (
          <div className="animate-in fade-in-50 duration-500">
             <ResultsDisplay results={results} />
          </div>
        )}
      </div>

      <footer className="text-center mt-20 text-sm text-muted-foreground">
        <p>
          Disclaimer: BetterCallCamp provides AI-generated information and is not a substitute for professional legal advice.
        </p>
      </footer>
    </main>
  );
}
