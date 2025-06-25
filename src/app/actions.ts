'use server';

import { z } from 'zod';
import { explainMathProblem } from '@/ai/flows/explain-math-problem';
import { improveExplanation } from '@/ai/flows/improve-explanation';
import type { ExplanationState, HistoryItem } from '@/lib/types';

const problemSchema = z.string().min(3, 'Please enter a valid math problem.');

export async function explainProblemAction(
  prevState: ExplanationState,
  formData: FormData
): Promise<ExplanationState> {
  const problem = formData.get('problem') as string;

  const validatedProblem = problemSchema.safeParse(problem);

  if (!validatedProblem.success) {
    return {
      error: validatedProblem.error.errors[0].message,
      key: prevState.key ? prevState.key + 1 : 1,
    };
  }

  try {
    const result = await explainMathProblem({ problem: validatedProblem.data });
    return {
      id: Date.now().toString(),
      problem: validatedProblem.data,
      explanation: result.explanation,
      topic: result.topic,
      key: prevState.key ? prevState.key + 1 : 1,
    };
  } catch (error) {
    console.error(error);
    return {
      error: 'The AI tutor had an issue. Please try again later.',
      key: prevState.key ? prevState.key + 1 : 1,
    };
  }
}

export async function improveExplanationAction(
  item: HistoryItem
): Promise<{ updatedExplanation?: string; error?: string }> {
  if (!item.problem || !item.explanation) {
    return { error: 'Cannot improve an empty problem or explanation.' };
  }
  try {
    const result = await improveExplanation({
      problem: item.problem,
      explanation: item.explanation,
    });
    return { updatedExplanation: result.updatedExplanation };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to improve the explanation. Please try again.' };
  }
}
