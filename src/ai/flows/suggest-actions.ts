// src/ai/flows/suggest-actions.ts
'use server';
/**
 * @fileOverview A flow that suggests actionable steps a user can take to resolve their grievance.
 *
 * - suggestActions - A function that suggests actionable steps based on the grievance and its classification.
 * - SuggestActionsInput - The input type for the suggestActions function.
 * - SuggestActionsOutput - The return type for the suggestActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestActionsInputSchema = z.object({
  userName: z.string().optional().describe("The user's name."),
  grievance: z.string().describe('The user-submitted grievance in plain text.'),
  classification: z.string().describe('The classification of the grievance (e.g., Rent Dispute, Internship Issue, College Harassment).'),
});
export type SuggestActionsInput = z.infer<typeof SuggestActionsInputSchema>;

const SuggestActionsOutputSchema = z.object({
  actions: z.array(z.string()).describe('A list of 2-3 actionable steps the user can take to resolve their grievance.'),
});
export type SuggestActionsOutput = z.infer<typeof SuggestActionsOutputSchema>;

export async function suggestActions(input: SuggestActionsInput): Promise<SuggestActionsOutput> {
  return suggestActionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestActionsPrompt',
  input: {schema: SuggestActionsInputSchema},
  output: {schema: SuggestActionsOutputSchema},
  prompt: `You are an AI assistant helping users resolve their grievances. Given the user's grievance and its classification, suggest 2-3 actionable steps the user can take to resolve their grievance.
{{#if userName}}
Keep in mind you are addressing {{{userName}}}.
{{/if}}
Grievance: {{{grievance}}}
Classification: {{{classification}}}

Actions:`,
});

const suggestActionsFlow = ai.defineFlow(
  {
    name: 'suggestActionsFlow',
    inputSchema: SuggestActionsInputSchema,
    outputSchema: SuggestActionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
