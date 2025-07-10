import { config } from 'dotenv';
config();

import '@/ai/flows/suggest-actions.ts';
import '@/ai/flows/classify-grievance.ts';
import '@/ai/flows/generate-complaint-letter.ts';
import '@/ai/flows/explain-rights.ts';
import '@/ai/flows/generate-evidence-checklist.ts';
