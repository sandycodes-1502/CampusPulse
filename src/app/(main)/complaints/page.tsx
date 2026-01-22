<<<<<<< HEAD
'use client'; // For DropdownMenu and any future interactions

import { PageHeader } from '@/components/layout/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
=======

import { PageHeader } from '@/components/layout/page-header';
import { complaints } from '@/lib/data';
>>>>>>> 679d7a337a06e817fa56902ae1df6d597b1339a8
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
<<<<<<< HEAD
import { Badge } from '@/components/ui/badge';
import { complaints } from '@/lib/data';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
=======
>>>>>>> 679d7a337a06e817fa56902ae1df6d597b1339a8

export default function ComplaintsPage() {
  return (
    <>
<<<<<<< HEAD
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
                  <TableHead className="w-[200px] hidden md:table-cell">Student</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead className="hidden sm:table-cell w-[120px]">Category</TableHead>
                  <TableHead className="hidden sm:table-cell w-[120px]">Status</TableHead>
                  <TableHead className="hidden md:table-cell w-[120px] text-right">Date</TableHead>
                  <TableHead className="w-[50px]">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell className="hidden md:table-cell">
                      <div className="font-medium">{complaint.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {complaint.roomNumber}
                      </div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium md:hidden">{complaint.studentName} ({complaint.roomNumber})</div>
                        <p className="text-sm text-muted-foreground max-w-xs truncate">{complaint.description}</p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">{complaint.category}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={cn(
                          'capitalize',
                          complaint.status === 'Resolved' &&
                            'bg-green-100 text-green-800 border-green-200',
                          complaint.status === 'In Progress' &&
                            'bg-amber-100 text-amber-800 border-amber-200',
                          complaint.status === 'Pending' &&
                            'bg-red-100 text-red-800 border-red-200'
                        )}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                     <TableCell className="hidden md:table-cell text-right">
                      {complaint.date}
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
                          <DropdownMenuItem>Mark as In Progress</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
=======
      <PageHeader
        title="Complaint Tracker"
        description="Manage and track hostel complaints, ensuring timely resolution."
      />
      <div className="container mx-auto py-10">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Student Name</TableHead>
              <TableHead>Room Number</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {complaints.map((complaint) => (
              <TableRow key={complaint.id}>
                <TableCell>{complaint.id}</TableCell>
                <TableCell>{complaint.studentName}</TableCell>
                <TableCell>{complaint.roomNumber}</TableCell>
                <TableCell>{complaint.category}</TableCell>
                <TableCell>{complaint.description}</TableCell>
                <TableCell>{complaint.status}</TableCell>
                <TableCell>{complaint.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
>>>>>>> 679d7a337a06e817fa56902ae1df6d597b1339a8
      </div>
    </>
  );
}
