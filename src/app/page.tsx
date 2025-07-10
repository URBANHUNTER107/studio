'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { saveName } from '@/lib/firestore';
import { useToast } from '@/hooks/use-toast';
import { User } from 'lucide-react';

export default function Home() {
  const [name, setName] = useState('');
  const { toast } = useToast();
  const router = useRouter();

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '') {
      toast({
        title: 'Error',
        description: 'Please enter your name.',
        variant: 'destructive',
      });
      return;
    }
    try {
      await saveName(name);
      toast({
        title: 'Welcome!',
        description: `Thanks for telling us your name, ${name}.`,
      });
      router.push('/grievance');
    } catch (error) {
      console.error("Error saving name: ", error);
      toast({
        title: 'Error',
        description: 'Could not save your name. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <main className="container mx-auto px-4 py-12 md:py-20 flex flex-col min-h-screen">
       <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold font-headline text-primary tracking-tight">
          BetterCallCamp
        </h1>
        <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
          When systems fail you, Camp stands by you.
        </p>
      </header>
      
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-lg mx-auto shadow-lg animate-in fade-in-50 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <User className="text-primary" />
              Let's Get Started
            </CardTitle>
            <CardDescription>
              First, please tell us your name.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleNameSubmit} className="flex gap-4">
              <Input
                type="text"
                placeholder="What is your Name?"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-grow"
              />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Continue
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <footer className="text-center mt-20 text-sm text-muted-foreground">
        <p>
          Disclaimer: BetterCallCamp provides AI-generated information and is not a substitute for professional legal advice.
        </p>
      </footer>
    </main>
  );
}
