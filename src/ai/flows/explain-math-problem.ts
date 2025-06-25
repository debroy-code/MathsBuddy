'use server';

/**
 * @fileOverview Explains a math problem step by step using an AI model.
 *
 * - explainMathProblem - A function that handles the math problem explanation process.
 * - ExplainMathProblemInput - The input type for the explainMathProblem function.
 * - ExplainMathProblemOutput - The return type for the explainMathProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainMathProblemInputSchema = z.object({
  problem: z.string().describe('The math problem to be explained.'),
});
export type ExplainMathProblemInput = z.infer<typeof ExplainMathProblemInputSchema>;

const ExplainMathProblemOutputSchema = z.object({
  explanation: z.string().describe('The step-by-step explanation of the math problem.'),
  topic: z.string().describe('The math topic or concept the problem relates to.'),
});
export type ExplainMathProblemOutput = z.infer<typeof ExplainMathProblemOutputSchema>;

export async function explainMathProblem(input: ExplainMathProblemInput): Promise<ExplainMathProblemOutput> {
  return explainMathProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainMathProblemPrompt',
  input: {schema: ExplainMathProblemInputSchema},
  output: {schema: ExplainMathProblemOutputSchema},
  prompt: `You are an expert math tutor. Provide a step-by-step explanation for the following math problem. Also, identify the math topic or concept the question relates to.\n\nProblem: {{{problem}}}`,
});

const explainMathProblemFlow = ai.defineFlow(
  {
    name: 'explainMathProblemFlow',
    inputSchema: ExplainMathProblemInputSchema,
    outputSchema: ExplainMathProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
