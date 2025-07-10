'use server';

/**
 * @fileOverview A flow that generates a checklist of evidence for a user to gather based on their grievance.
 *
 * - generateEvidenceChecklist - A function that generates an evidence checklist.
 * - GenerateEvidenceChecklistInput - The input type for the generateEvidenceChecklist function.
 * - GenerateEvidenceChecklistOutput - The return type for the generateEvidenceChecklist function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateEvidenceChecklistInputSchema = z.object({
  grievance: z.string().describe('The user-submitted grievance in plain text.'),
  classification: z
    .string()
    .describe(
      'The classification of the grievance (e.g., Rent Dispute, Internship Issue, College Harassment).'
    ),
});
export type GenerateEvidenceChecklistInput = z.infer<typeof GenerateEvidenceChecklistInputSchema>;

const GenerateEvidenceChecklistOutputSchema = z.object({
  evidence: z
    .array(z.string())
    .describe('A list of potential evidence the user should gather to support their case.'),
});
export type GenerateEvidenceChecklistOutput = z.infer<typeof GenerateEvidenceChecklistOutputSchema>;

export async function generateEvidenceChecklist(
  input: GenerateEvidenceChecklistInput
): Promise<GenerateEvidenceChecklistOutput> {
  return generateEvidenceChecklistFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateEvidenceChecklistPrompt',
  input: {schema: GenerateEvidenceChecklistInputSchema},
  output: {schema: GenerateEvidenceChecklistOutputSchema},
  prompt: `You are an AI legal assistant. Based on the user's grievance and its classification, generate a checklist of specific documents and evidence they should gather to build a strong case.

Grievance: {{{grievance}}}
Classification: {{{classification}}}

Provide a list of evidence to collect:`,
});

const generateEvidenceChecklistFlow = ai.defineFlow(
  {
    name: 'generateEvidenceChecklistFlow',
    inputSchema: GenerateEvidenceChecklistInputSchema,
    outputSchema: GenerateEvidenceChecklistOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
