'use client';

import {
  collection,
  query,
  orderBy,
  doc,
  deleteDoc,
} from 'firebase/firestore';
import { FileEdit, PlusCircle, Trash } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
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
import { Skeleton } from '@/components/ui/skeleton';
import type { Announcement } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function AnnouncementsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'announcements'),
      orderBy('postDate', 'desc')
    );
  }, [firestore]);

  const { data: announcements, isLoading } =
    useCollection<Announcement>(announcementsQuery);

  const handleDelete = (id: string) => {
    if (!firestore) return;
    const announcementRef = doc(firestore, 'announcements', id);
    deleteDocumentNonBlocking(announcementRef);
    toast({ title: 'Announcement deleted.' });
  };

  const canManage = true; // Auth removed, default to admin view

  return (
    <>
      <PageHeader title="Announcements">
        {canManage && (
          <Button asChild>
            <Link href="#">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Announcement
            </Link>
          </Button>
        )}
      </PageHeader>
      <div className="flex-1 space-y-6 p-4 md:p-8 pt-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
              {canManage && (
                <CardFooter className="flex justify-end gap-2">
                  <Skeleton className="h-9 w-24" />
                  <Skeleton className="h-9 w-24" />
                </CardFooter>
              )}
            </Card>
          ))
        ) : announcements?.length > 0 ? (
          announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <CardTitle>{announcement.title}</CardTitle>
                <CardDescription>
                  Posted on{' '}
                  {format(new Date(announcement.postDate), 'MMMM dd, yyyy')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </CardContent>
              {canManage && (
                <CardFooter className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <FileEdit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          delete the announcement.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(announcement.id)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              )}
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-20 border-2 border-dashed rounded-lg">
            <h3 className="text-lg font-semibold">No Announcements Yet</h3>
            <p className="mt-1 text-sm">
              {canManage
                ? 'Click "New Announcement" to post the first one.'
                : 'There are no announcements right now.'}
            </p>
          </div>
        )}
      </div>
    </>
  );
}
