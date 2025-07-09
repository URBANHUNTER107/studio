'use server';

/**
 * @fileOverview A grievance classification AI agent.
 *
 * - classifyGrievance - A function that handles the grievance classification process.
 * - ClassifyGrievanceInput - The input type for the classifyGrievance function.
 * - ClassifyGrievanceOutput - The return type for the classifyGrievance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClassifyGrievanceInputSchema = z.object({
  grievanceText: z.string().describe('The grievance text to classify.'),
});
export type ClassifyGrievanceInput = z.infer<typeof ClassifyGrievanceInputSchema>;

const ClassifyGrievanceOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('The categories the grievance belongs to.'),
});
export type ClassifyGrievanceOutput = z.infer<typeof ClassifyGrievanceOutputSchema>;

export async function classifyGrievance(input: ClassifyGrievanceInput): Promise<ClassifyGrievanceOutput> {
  return classifyGrievanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'classifyGrievancePrompt',
  input: {schema: ClassifyGrievanceInputSchema},
  output: {schema: ClassifyGrievanceOutputSchema},
  prompt: `You are an AI expert in classifying grievances.

  Your task is to classify the grievance text into relevant categories.
  The possible categories are: Rent Dispute, Internship Issue, College Harassment.

  Grievance Text: {{{grievanceText}}}
  Categories:`, // The LLM should return an array of strings in JSON format.
});

const classifyGrievanceFlow = ai.defineFlow(
  {
    name: 'classifyGrievanceFlow',
    inputSchema: ClassifyGrievanceInputSchema,
    outputSchema: ClassifyGrievanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
