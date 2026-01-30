'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Fee } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { fees as initialFees } from '@/lib/data';

// For demonstration, we'll filter for a specific student.
// In a real app, this would come from an authentication context.
const MOCK_CURRENT_STUDENT_ID = 'student03'; // Charlie Brown

export default function MyFeesPage() {
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    setTimeout(() => {
      const studentFees = initialFees.filter(
        (fee) => fee.studentId === MOCK_CURRENT_STUDENT_ID
      );
      setFees(studentFees);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <>
      <PageHeader title="My Fee Status" />
      <div className="container mx-auto py-10">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Skeleton className="h-10 w-full" />
                  </TableCell>
                </TableRow>
              ) : fees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No fee records found for your account.
                  </TableCell>
                </TableRow>
              ) : (
                fees.map((fee: Fee) => (
                  <TableRow key={fee.id}>
                    <TableCell>{fee.studentId}</TableCell>
                    <TableCell>{fee.studentName}</TableCell>
                    <TableCell className="text-right">
                      ${fee.amount.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      {new Date(fee.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        className={cn(
                          'capitalize',
                          fee.status === 'paid' &&
                            'bg-green-100 text-green-800 border-green-200',
                          fee.status === 'unpaid' &&
                            'bg-amber-100 text-amber-800 border-amber-200',
                          fee.status === 'overdue' &&
                            'bg-red-100 text-red-800 border-red-200'
                        )}
                      >
                        {fee.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
