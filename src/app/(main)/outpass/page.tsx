'use client';

import {
  query,
  orderBy,
  doc,
  collectionGroup,
} from 'firebase/firestore';
import { MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
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
import type { Outpass } from '@/lib/types';
import { cn } from '@/lib/utils';
import { updateDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useToast } from '@/hooks/use-toast';

export default function OutpassPage() {
  const firestore = useFirestore();
  const { toast } = useToast();

  const outpassesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    
    // Default to admin/security view since auth is removed
    return query(collectionGroup(firestore, 'outpasses'), orderBy('departureDateTime', 'desc'));
    
  }, [firestore]);

  const { data: outpasses, isLoading } = useCollection<Outpass>(outpassesQuery);

  const handleStatusChange = (outpass: Outpass, status: 'approved' | 'rejected' | 'used') => {
    if (!firestore || !outpass.studentId) return;
    const outpassRef = doc(firestore, 'users', outpass.studentId, 'outpasses', outpass.id);
    updateDocumentNonBlocking(outpassRef, { status });
    toast({ title: `Outpass has been ${status}.` });
  };

  const isActionable = true; // Default to admin/security view

  return (
    <>
      <PageHeader title="Digital Outpass">
        {/* "New Outpass" button removed as it's a student-specific action */}
      </PageHeader>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Card>
          <CardHeader>
            <CardTitle>Outpass Requests</CardTitle>
            <CardDescription>
              Manage and track all student outpass requests.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] hidden md:table-cell">Student</TableHead>
                  <TableHead>Destination & Reason</TableHead>
                  <TableHead className="hidden sm:table-cell">Dates</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                  {isActionable && (
                    <TableHead className="w-[50px]">
                      <span className="sr-only">Actions</span>
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell className="hidden sm:table-cell"><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell className="hidden sm:table-cell text-center"><Skeleton className="h-6 w-20 mx-auto" /></TableCell>
                      {isActionable && <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>}
                    </TableRow>
                  ))
                ) : outpasses?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isActionable ? 5 : 4} className="h-24 text-center">
                      No outpass requests found.
                    </TableCell>
                  </TableRow>
                ) : (
                  outpasses?.map((outpass) => (
                    <TableRow key={outpass.id}>
                      <TableCell className="hidden md:table-cell">
                        <div className="font-medium">{outpass.studentName}</div>
                        <div className="text-sm text-muted-foreground">
                          {outpass.roomNumber}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium md:hidden">{outpass.studentName}</div>
                        <div className="font-medium">{outpass.reason}</div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {format(new Date(outpass.departureDateTime), 'dd MMM yyyy, p')} -{' '}
                        {format(new Date(outpass.returnDateTime), 'dd MMM yyyy, p')}
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-center">
                        <Badge
                          variant="outline"
                          className={cn('capitalize',
                            outpass.status === 'approved' && 'bg-green-100 text-green-800 border-green-200',
                            outpass.status === 'pending' && 'bg-amber-100 text-amber-800 border-amber-200',
                            outpass.status === 'rejected' && 'bg-red-100 text-red-800 border-red-200',
                            outpass.status === 'used' && 'bg-blue-100 text-blue-800 border-blue-200'
                          )}
                        >
                          {outpass.status}
                        </Badge>
                      </TableCell>
                      {isActionable && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button aria-haspopup="true" size="icon" variant="ghost" disabled={outpass.status !== 'pending'}>
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Toggle menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleStatusChange(outpass, 'approved')}>Approve</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleStatusChange(outpass, 'rejected')}>Reject</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
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
