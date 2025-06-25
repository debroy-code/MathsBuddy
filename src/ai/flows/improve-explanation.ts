'use server';

/**
 * @fileOverview This file contains the Genkit flow for improving math explanations.
 *
 * - improveExplanation - A function that calls the improveExplanationFlow to get an updated explanation.
 * - ImproveExplanationInput - The input type for the improveExplanation function, including the original problem and explanation.
 * - ImproveExplanationOutput - The return type for the improveExplanation function, containing the updated explanation.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveExplanationInputSchema = z.object({
  problem: z.string().describe('The math problem to explain.'),
  explanation: z.string().describe('The current explanation of the problem.'),
});
export type ImproveExplanationInput = z.infer<typeof ImproveExplanationInputSchema>;

const ImproveExplanationOutputSchema = z.object({
  updatedExplanation: z.string().describe('The updated explanation of the math problem.'),
});
export type ImproveExplanationOutput = z.infer<typeof ImproveExplanationOutputSchema>;

export async function improveExplanation(input: ImproveExplanationInput): Promise<ImproveExplanationOutput> {
  return improveExplanationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveExplanationPrompt',
  input: {schema: ImproveExplanationInputSchema},
  output: {schema: ImproveExplanationOutputSchema},
  prompt: `You are an expert math tutor. A student is having trouble understanding the following math problem and its explanation.  Your job is to improve the explanation so that it is easier to understand.

Math Problem: {{{problem}}}

Current Explanation: {{{explanation}}}

Improved Explanation:`,
});

const improveExplanationFlow = ai.defineFlow(
  {
    name: 'improveExplanationFlow',
    inputSchema: ImproveExplanationInputSchema,
    outputSchema: ImproveExplanationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return {updatedExplanation: output!.updatedExplanation};
  }
);
