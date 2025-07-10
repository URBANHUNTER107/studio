'use server';

import { classifyGrievance } from '@/ai/flows/classify-grievance';
import { explainRights } from '@/ai/flows/explain-rights';
import { suggestActions } from '@/ai/flows/suggest-actions';
import { generateComplaintLetter } from '@/ai/flows/generate-complaint-letter';
import { firestore } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export interface GrievanceResults {
  classification: string[];
  rights: string;
  actions: string[];
  letter: string;
}

export async function saveName(name: string) {
  if (!name.trim()) {
    throw new Error('Name cannot be empty.');
  }
  try {
    await addDoc(collection(firestore, 'users'), {
      name: name,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding document: ', error);
    throw new Error('Could not save name to Firestore.');
  }
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
