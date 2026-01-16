import { PageHeader } from '@/components/layout/page-header';

export default function FeesPage() {
  return (
    <>
      <PageHeader title="Fee Management" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Hostel Fee Management</h1>
        <p className="text-muted-foreground mt-2">
          Track and manage hostel fees, providing students with their fee status. This feature is under construction.
        </p>
      </div>
    </>
  );
}
