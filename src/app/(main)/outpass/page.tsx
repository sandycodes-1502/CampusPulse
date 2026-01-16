import { PageHeader } from '@/components/layout/page-header';

export default function OutpassPage() {
  return (
    <>
      <PageHeader title="Digital Outpass" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Digital Outpass System</h1>
        <p className="text-muted-foreground mt-2">
          Enable students to request outpasses digitally, and security to verify them. This feature is under construction.
        </p>
      </div>
    </>
  );
}
