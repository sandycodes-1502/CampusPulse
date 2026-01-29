'use client';

import { useState } from 'react';
import { Loader, Wand2, Inbox } from 'lucide-react';
import { format } from 'date-fns';

import { useToast } from '@/hooks/use-toast';
import { useFeedbackStore } from '@/hooks/use-feedback-store';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

const mockAnalysisSummary = `Based on the feedback, several key themes have emerged:

1.  **Wi-Fi Connectivity**: The most common issue is the unreliable Wi-Fi in the B-Wing hostel, with multiple students reporting frequent disconnections.
2.  **Mess Food Quality**: Feedback on mess food is mixed. While breakfast is generally appreciated, there are calls to improve the variety and quality of dinner.
3.  **Library Hours**: Several students have requested an extension of library operating hours during exam periods to facilitate late-night study sessions.
4.  **Sports Facilities**: Positive comments were received regarding the new basketball court, but the gym equipment requires maintenance.`;

export function FeedbackAnalysis() {
  const { toast } = useToast();
  const { feedback, isLoading: isLoadingFeedback } = useFeedbackStore();

  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!feedback || feedback.length === 0) {
      toast({
        title: 'No Feedback to Analyze',
        description: 'There is no student feedback available to analyze.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setAnalysis(null);

    // Simulate AI analysis delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setAnalysis(mockAnalysisSummary);
    toast({
      title: 'Analysis Complete',
      description: 'Key trends from student feedback have been summarized.',
    });
    
    setIsLoading(false);
  };

  if (isLoadingFeedback) {
    return (
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 border rounded-lg bg-muted/20">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2 sticky top-20">
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-full" />
          </CardHeader>
          <CardContent className="py-10">
            <Skeleton className="h-24 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
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
              A collection of all feedback submitted by students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {feedback && feedback.length > 0 ? (
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {feedback.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 border rounded-lg bg-muted/20"
                    >
                      <div className="flex justify-between items-start">
                        <p className="text-sm text-foreground">
                          {item.feedbackText}
                        </p>
                        <Badge variant="outline">{item.category}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        {format(new Date(item.submissionDate), 'MMM d, yyyy')}{' '}
                        &middot; {item.studentName}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center h-[500px] text-center p-4 border-2 border-dashed rounded-lg">
                <Inbox className="h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No Feedback Yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  When students submit feedback, it will appear here.
                </p>
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
                <p>
                  Click "Analyze Feedback" to generate a summary of all
                  feedback entries.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleAnalyze}
              disabled={isLoading || !feedback || feedback.length === 0}
              className="w-full"
            >
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
