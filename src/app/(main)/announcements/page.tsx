import { PageHeader } from '@/components/layout/page-header';

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader title="Announcements" />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold">Announcement System</h1>
        <p className="text-muted-foreground mt-2">
          Post important announcements and notices for students. This feature is under construction.
        </p>
      </div>
    </>
  );
}
