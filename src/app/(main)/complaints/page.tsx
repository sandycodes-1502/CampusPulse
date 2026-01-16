import { PageHeader } from '@/components/layout/page-header';

export default function ComplaintsPage() {
  return (
    <>
      <PageHeader title="Complaint Tracker" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Hostel Complaint Tracker</h1>
        <p className="text-muted-foreground mt-2">
          Manage and track hostel complaints, ensuring timely resolution. This feature is under construction.
        </p>
      </div>
    </>
  );
}
