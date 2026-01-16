'use client';

import { useState } from 'react';
import { Loader, Wand2, Inbox } from 'lucide-react';

import { useFeedbackStore } from '@/hooks/use-feedback-store';
import { useToast } from '@/hooks/use-toast';
import { analyzeStudentFeedback } from '@/ai/flows/analyze-student-feedback';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

export function FeedbackAnalysis() {
  const { feedback, isInitialized } = useFeedbackStore();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (feedback.length === 0) {
      toast({
        title: 'No Feedback to Analyze',
        description: 'There is no student feedback available to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    try {
      const allFeedbackText = feedback.map(f => `- ${f.feedback}`).join('\n');
      const result = await analyzeStudentFeedback({ feedback: allFeedbackText });
      setAnalysis(result.summary);
      toast({
        title: 'Analysis Complete',
        description: 'Key trends from student feedback have been summarized.',
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: 'Analysis Failed',
        description: 'Something went wrong while analyzing the feedback. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Student Feedback Inbox</CardTitle>
            <CardDescription>
              A collection of all anonymous feedback submitted by students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg bg-muted/20">
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-foreground">{item.feedback}</p>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">{item.date}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
                <div className="flex flex-col items-center justify-center h-[500px] text-center p-4 border-2 border-dashed rounded-lg">
                    <Inbox className="h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Feedback Yet</h3>
                    <p className="mt-1 text-sm text-muted-foreground">When students submit feedback, it will appear here.</p>
                </div>
            )}
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-2">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle>AI-Powered Analysis</CardTitle>
            <CardDescription>
              Use AI to identify key trends and issues from the feedback.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {analysis ? (
              <div className="space-y-4">
                <h3 className="font-semibold">Summary of Key Trends</h3>
                <div className="prose prose-sm max-w-none text-foreground whitespace-pre-wrap">
                  {analysis}
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-10">
                <Wand2 className="mx-auto h-10 w-10 mb-4" />
                <p>Click "Analyze Feedback" to generate a summary of all feedback entries.</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Analyze Feedback
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
