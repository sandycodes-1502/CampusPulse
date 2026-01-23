'use client'; // For DropdownMenu and any future interactions

import {
  collection,
  query,
  orderBy,
  doc,
  updateDoc,
} from 'firebase/firestore';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import type { Complaint } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';

export default function ComplaintsPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const complaintsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'complaints'),
      orderBy('submissionDate', 'desc')
    );
  }, [firestore]);

  const { data: complaints, isLoading } =
    useCollection<Complaint>(complaintsQuery);

  const handleStatusChange = (
    id: string,
    status: 'in progress' | 'resolved'
  ) => {
    if (!firestore) return;
    const complaintRef = doc(firestore, 'complaints', id);
    updateDocumentNonBlocking(complaintRef, { status });
    toast({ title: `Complaint status updated to ${status}.` });
  };

  return (
    <>
      <PageHeader title="Hostel Complaint Tracker" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>All Complaints</CardTitle>
            <CardDescription>
              Here is a list of all complaints submitted by students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] hidden md:table-cell">
                    Student
                  </TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead className="hidden sm:table-cell w-[120px]">
                    Status
                  </TableHead>
                  <TableHead className="hidden md:table-cell w-[120px] text-right">
                    Date
                  </TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden md:table-cell">
                        <Skeleton className="h-4 w-32" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Skeleton className="h-6 w-20" />
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        <Skeleton className="h-4 w-24 ml-auto" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-8 w-8 ml-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : complaints?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No complaints found.
                    </TableCell>
                  </TableRow>
                ) : (
                  complaints?.map((complaint) => (
                    <TableRow key={complaint.id}>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">
                          {complaint.studentName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {complaint.roomNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium md:hidden">
                          {complaint.studentName} ({complaint.roomNumber})
                        </div>
                        <p className="text-sm text-muted-foreground max-w-xs truncate">
                          {complaint.complaintText}
                        </p>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <Badge
                          variant="outline"
                          className={cn(
                            'capitalize',
                            complaint.status === 'resolved' &&
                              'bg-green-100 text-green-800 border-green-200',
                            complaint.status === 'in progress' &&
                              'bg-amber-100 text-amber-800 border-amber-200',
                            complaint.status === 'open' &&
                              'bg-red-100 text-red-800 border-red-200'
                          )}
                        >
                          {complaint.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-right">
                        {format(
                          new Date(complaint.submissionDate),
                          'MMM d, yyyy'
                        )}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(complaint.id, 'in progress')
                              }
                            >
                              Mark as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleStatusChange(complaint.id, 'resolved')
                              }
                            >
                              Mark as Resolved
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
