// src/ai/flows/generate-complaint-letter.ts
'use server';

/**
 * @fileOverview Generates a complaint letter based on the user's grievance and identified rights.
 *
 * - generateComplaintLetter - A function that generates the complaint letter.
 * - GenerateComplaintLetterInput - The input type for the generateComplaintLetter function.
 * - GenerateComplaintLetterOutput - The return type for the generateComplaintLetter function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateComplaintLetterInputSchema = z.object({
  userName: z.string().optional().describe("The user's name."),
  grievance: z.string().describe('The user-submitted grievance.'),
  rightsExplanation: z.string().describe('Explanation of the user\'s rights.'),
  suggestedActions: z.string().describe('Suggested actions for the user to take.'),
});
export type GenerateComplaintLetterInput = z.infer<typeof GenerateComplaintLetterInputSchema>;

const GenerateComplaintLetterOutputSchema = z.object({
  complaintLetter: z.string().describe('The generated complaint letter.'),
});
export type GenerateComplaintLetterOutput = z.infer<typeof GenerateComplaintLetterOutputSchema>;

export async function generateComplaintLetter(input: GenerateComplaintLetterInput): Promise<GenerateComplaintLetterOutput> {
  return generateComplaintLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateComplaintLetterPrompt',
  input: {schema: GenerateComplaintLetterInputSchema},
  output: {schema: GenerateComplaintLetterOutputSchema},
  prompt: `You are a legal assistant whose job is to generate a draft complaint letter based on the user's grievance, rights, and suggested actions.

The letter should be from the user, so use their name, {{{userName}}}, to sign off at the end of the letter.

Grievance: {{{grievance}}}

Rights Explanation: {{{rightsExplanation}}}

Suggested Actions: {{{suggestedActions}}}

Generate a concise and professional complaint letter incorporating the above information.`,
});

const generateComplaintLetterFlow = ai.defineFlow(
  {
    name: 'generateComplaintLetterFlow',
    inputSchema: GenerateComplaintLetterInputSchema,
    outputSchema: GenerateComplaintLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
