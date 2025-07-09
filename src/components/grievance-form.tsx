'use client';

import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Loader2 } from 'lucide-react';

const formSchema = z.object({
  grievance: z.string().min(50, {
    message: 'Please describe your grievance in at least 50 characters.',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface GrievanceFormProps {
  onSubmit: (data: FormValues) => void;
  isLoading: boolean;
}

export function GrievanceForm({ onSubmit, isLoading }: GrievanceFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      grievance: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormValues> = (data) => {
    onSubmit(data);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
          <FileText className="text-primary" />
          Describe Your Problem
        </CardTitle>
        <CardDescription>
          Hey there, I'm Camp, an AI-Advocate to guide and help you with 
          my knowledge Because everyone deserves a fair hearing.  
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="grievance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Describe Your Situation</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="For example: 'My landlord is refusing to return my security deposit even though I left the apartment in perfect condition...' "
                      rows={8}
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Thinking about Your situation...
                </>
              ) : (
                'Ask From Camp'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
