'use server';

/**
 * @fileOverview Explains the user's rights related to the grievance in simple terms.
 *
 * - explainRights - A function that explains the user's rights.
 * - ExplainRightsInput - The input type for the explainRights function.
 * - ExplainRightsOutput - The return type for the explainRights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainRightsInputSchema = z.object({
  userName: z.string().optional().describe("The user's name."),
  grievanceCategory: z
    .string()
    .describe('The category of the grievance (e.g., Rent Dispute, Internship Issue, College Harassment).'),
  grievanceDescription: z.string().describe('The description of the grievance.'),
});
export type ExplainRightsInput = z.infer<typeof ExplainRightsInputSchema>;

const ExplainRightsOutputSchema = z.object({
  rightsExplanation: z
    .string()
    .describe('An explanation of the user rights related to the grievance in simple terms.'),
});
export type ExplainRightsOutput = z.infer<typeof ExplainRightsOutputSchema>;

export async function explainRights(input: ExplainRightsInput): Promise<ExplainRightsOutput> {
  return explainRightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainRightsPrompt',
  input: {schema: ExplainRightsInputSchema},
  output: {schema: ExplainRightsOutputSchema},
  prompt: `You are an AI assistant that explains user rights related to a grievance in simple terms.
{{#if userName}}
Address the user by their name, {{{userName}}}.
{{/if}}
Grievance Category: {{{grievanceCategory}}}
Grievance Description: {{{grievanceDescription}}}

Explain the user's rights related to the grievance in simple terms:`, config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_MEDIUM_AND_ABOVE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_LOW_AND_ABOVE',
      },
    ],
  },
});

const explainRightsFlow = ai.defineFlow(
  {
    name: 'explainRightsFlow',
    inputSchema: ExplainRightsInputSchema,
    outputSchema: ExplainRightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
