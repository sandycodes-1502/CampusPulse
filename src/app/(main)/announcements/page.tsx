import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { announcements } from '@/lib/data';
import { format } from 'date-fns';
import { FileEdit, PlusCircle, Trash } from 'lucide-react';
import Link from 'next/link';

export default function AnnouncementsPage() {
  return (
    <>
      <PageHeader title="Announcements">
        <Button asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Announcement
          </Link>
        </Button>
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  Posted on{' '}
                  {format(new Date(announcement.date), 'MMMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">No Announcements Yet</h3>
            <p className="mt-1 text-sm">Click "New Announcement" to post the first one.</p>
          </div>
        )}
      </div>
    </>
  );
}
