import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
GOOGLE_API_KEY='AIzaSyBCtMOZq5-29SpCYoaConrhEtqi7avQxCk'
export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
