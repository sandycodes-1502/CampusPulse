'use client';

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
import { MoreHorizontal, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { outpasses } from '@/lib/outpass';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function OutpassPage() {
  return (
    <>
      <PageHeader title="Digital Outpass">
        <Button asChild>
          <Link href="#">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Outpass Request
          </Link>
        </Button>
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
                  <TableHead>Destination</TableHead>
                  <TableHead className="hidden sm:table-cell">Dates</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {outpasses.map((outpass) => (
                  <TableRow key={outpass.id}>
                    <TableCell className="hidden md:table-cell">
                      <div className="font-medium">{outpass.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {outpass.studentId} &middot; {outpass.roomNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium md:hidden">{outpass.studentName}</div>
                      <div className="font-medium">{outpass.destination}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px] sm:max-w-xs">
                        {outpass.reason}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {format(new Date(outpass.dateFrom), 'dd MMM yyyy')} -{' '}
                      {format(new Date(outpass.dateTo), 'dd MMM yyyy')}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          outpass.status === 'Approved' &&
                            'bg-green-100 text-green-800 border-green-200',
                          outpass.status === 'Pending' &&
                            'bg-amber-100 text-amber-800 border-amber-200',
                          outpass.status === 'Rejected' &&
                            'bg-red-100 text-red-800 border-red-200'
                        )}
                      >
                        {outpass.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>Approve</DropdownMenuItem>
                          <DropdownMenuItem>Reject</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}