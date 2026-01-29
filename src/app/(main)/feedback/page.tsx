import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { FeedbackAnalysis } from '@/components/feedback/feedback-analysis';
import { Button } from '@/components/ui/button';

export default function FeedbackPage() {
  const canManage = true; // Auth is removed, default to admin view

  return (
    <>
      <PageHeader title="Feedback Analytics">
        {canManage ? (
          <Button asChild>
            <Link href="/feedback/submit">
              <PlusCircle className="mr-2 h-4 w-4" />
              Submit New Feedback
            </Link>
          </Button>
        ) : null}
      </PageHeader>
      <div className="flex-1 p-4 md:p-8">
        <FeedbackAnalysis />
      </div>
    </>
  );
}
