'use server';

import { classifyGrievance } from '@/ai/flows/classify-grievance';
import { explainRights } from '@/ai/flows/explain-rights';
import { suggestActions } from '@/ai/flows/suggest-actions';
import { generateComplaintLetter } from '@/ai/flows/generate-complaint-letter';

export interface GrievanceResults {
  classification: string[];
  rights: string;
  actions: string[];
  letter: string;
}

export async function handleGrievance(grievance: string): Promise<{ data: GrievanceResults | null; error: string | null }> {
  try {
    if (!grievance) {
      return { data: null, error: 'Grievance text cannot be empty.' };
    }

    // 1. Classify Grievance
    const classificationResult = await classifyGrievance({ grievanceText: grievance });
    if (!classificationResult.categories || classificationResult.categories.length === 0) {
      return { data: null, error: 'Could not classify the grievance. Please try rephrasing.' };
    }
    const classification = classificationResult.categories;

    // 2. Explain Rights
    const rightsResult = await explainRights({
      grievanceCategory: classification[0], // Using the first category for simplicity
      grievanceDescription: grievance,
    });
    const rights = rightsResult.rightsExplanation;

    // 3. Suggest Actions
    const actionsResult = await suggestActions({
      grievance: grievance,
      classification: classification.join(', '),
    });
    const actions = actionsResult.actions;

    // 4. Generate Complaint Letter
    const letterResult = await generateComplaintLetter({
      grievance: grievance,
      rightsExplanation: rights,
      suggestedActions: actions.join('\n- '),
    });
    const letter = letterResult.complaintLetter;

    const results: GrievanceResults = {
      classification,
      rights,
      actions,
      letter,
    };

    return { data: results, error: null };
  } catch (e) {
    console.error(e);
    return { data: null, error: 'An unexpected error occurred. Please try again later.' };
  }
}
