import { PageHeader } from '@/components/layout/page-header';

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Entry/Exit Logging</h1>
        <p className="text-muted-foreground mt-2">
          Record student entry and exit times, providing daily logs for security. This feature is under construction.
        </p>
      </div>
    </>
  );
}
