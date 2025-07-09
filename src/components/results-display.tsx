import type { GrievanceResults } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookUser, ListChecks, Mail, Tags } from 'lucide-react';

interface ResultsDisplayProps {
  results: GrievanceResults;
}

export function ResultsDisplay({ results }: ResultsDisplayProps) {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <Tags className="text-primary" />
              Grievance Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {results.classification.map((category) => (
              <Badge key={category} variant="secondary" className="text-lg py-1 px-3">
                {category}
              </Badge>
            ))}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline">
              <BookUser className="text-primary" />
              Your Rights Explained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.rights}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <ListChecks className="text-primary" />
            What you should Do:-
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {results.actions.map((action, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  {index + 1}
                </div>
                <span className="text-sm text-muted-foreground">{action}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline">
            <Mail className="text-primary" />
            Your Complaint Letter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="bg-secondary/50 px-4 rounded-md hover:no-underline">
                View/Edit Your Draft Letter
              </AccordionTrigger>
              <AccordionContent className="pt-4 px-4">
                <p className="whitespace-pre-wrap text-sm text-muted-foreground border p-4 rounded-md bg-background">
                  {results.letter}
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
