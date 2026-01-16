'use server';

/**
 * @fileOverview An AI agent for analyzing student feedback and identifying key trends.
 *
 * - analyzeStudentFeedback - A function that handles the analysis of student feedback.
 * - AnalyzeStudentFeedbackInput - The input type for the analyzeStudentFeedback function.
 * - AnalyzeStudentFeedbackOutput - The return type for the analyzeStudentFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeStudentFeedbackInputSchema = z.object({
  feedback: z.string().describe('The anonymous student feedback to analyze.'),
});
export type AnalyzeStudentFeedbackInput = z.infer<
  typeof AnalyzeStudentFeedbackInputSchema
>;

const AnalyzeStudentFeedbackOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A summary of the key trends and issues identified in the student feedback.'
    ),
});
export type AnalyzeStudentFeedbackOutput = z.infer<
  typeof AnalyzeStudentFeedbackOutputSchema
>;

export async function analyzeStudentFeedback(
  input: AnalyzeStudentFeedbackInput
): Promise<AnalyzeStudentFeedbackOutput> {
  return analyzeStudentFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeStudentFeedbackPrompt',
  input: {schema: AnalyzeStudentFeedbackInputSchema},
  output: {schema: AnalyzeStudentFeedbackOutputSchema},
  prompt: `You are an AI assistant that analyzes student feedback and identifies key trends and issues. You will provide a summary of the feedback.

Feedback: {{{feedback}}}`,
});

const analyzeStudentFeedbackFlow = ai.defineFlow(
  {
    name: 'analyzeStudentFeedbackFlow',
    inputSchema: AnalyzeStudentFeedbackInputSchema,
    outputSchema: AnalyzeStudentFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
