'use client';

import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  Users,
  BedDouble,
  Ticket,
  FilePenLine,
} from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis, Tooltip } from 'recharts';
import {
  collection,
  query,
  orderBy,
  limit,
  where,
  collectionGroup,
} from 'firebase/firestore';
import { format } from 'date-fns';

import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
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
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Skeleton } from '@/components/ui/skeleton';
import type {
  Announcement,
  Complaint,
  Student,
  Room as HostelRoom,
  Outpass,
} from '@/lib/types';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

const chartData = [
  { time: '8am', entries: 5, exits: 2 },
  { time: '9am', entries: 12, exits: 4 },
  { time: '10am', entries: 8, exits: 15 },
  { time: '11am', entries: 7, exits: 5 },
  { time: '12pm', entries: 25, exits: 18 },
  { time: '1pm', entries: 15, exits: 22 },
  { time: '2pm', entries: 18, exits: 10 },
  { time: '3pm', entries: 20, exits: 30 },
  { time: '4pm', entries: 35, exits: 25 },
  { time: '5pm', entries: 40, exits: 50 },
];

const chartConfig = {
  entries: {
    label: 'Entries',
    color: 'hsl(var(--chart-2))',
  },
  exits: {
    label: 'Exits',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

export default function AdminDashboardPage() {
  const firestore = useFirestore();

  const announcementsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'announcements'),
      orderBy('postDate', 'desc'),
      limit(3)
    );
  }, [firestore]);

  const complaintsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collectionGroup(firestore, 'complaints'),
      orderBy('submissionDate', 'desc'),
      limit(5)
    );
  }, [firestore]);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collectionGroup(firestore, 'students'), orderBy('name'));
  }, [firestore]);

  const roomsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'hostel_rooms'), orderBy('roomNumber'));
  }, [firestore]);

  const pendingOutpassesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collectionGroup(firestore, 'outpasses'),
      where('status', '==', 'pending')
    );
  }, [firestore]);

  const activeComplaintsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collectionGroup(firestore, 'complaints'),
      where('status', 'in', ['open', 'in progress'])
    );
  }, [firestore]);

  const { data: announcements, isLoading: isLoadingAnnouncements } =
    useCollection<Announcement>(announcementsQuery);
  const { data: complaints, isLoading: isLoadingComplaints } =
    useCollection<Complaint>(complaintsQuery);
  const { data: students, isLoading: isLoadingStudents } =
    useCollection<Student>(studentsQuery);
  const { data: rooms, isLoading: isLoadingRooms } =
    useCollection<HostelRoom>(roomsQuery);
  const { data: pendingOutpasses, isLoading: isLoadingPendingOutpasses } =
    useCollection<Outpass>(pendingOutpassesQuery);
  const { data: activeComplaints, isLoading: isLoadingActiveComplaints } =
    useCollection<Complaint>(activeComplaintsQuery);

  const roomsOccupiedCount = useMemo(() => {
    if (!rooms || !students) return 0;
    const occupiedRoomIds = new Set(
      students.map((s) => s.hostelRoomId).filter(Boolean)
    );
    return occupiedRoomIds.size;
  }, [students, rooms]);

  const isLoadingStats =
    isLoadingStudents ||
    isLoadingRooms ||
    isLoadingPendingOutpasses ||
    isLoadingActiveComplaints;

  return (
    <>
      <PageHeader title="Admin Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{students?.length ?? 0}</div>
              )}
              <p className="text-xs text-muted-foreground">
                All registered students
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Rooms Occupied
              </CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {roomsOccupiedCount} / {rooms?.length ?? 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {rooms && rooms.length > 0 && roomsOccupiedCount > 0
                  ? `${Math.round(
                      (roomsOccupiedCount / rooms.length) * 100
                    )}% occupancy rate`
                  : '...'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Outpasses
              </CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">
                  {pendingOutpasses?.length ?? 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Complaints
              </CardTitle>
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">
                  {activeComplaints?.length ?? 0}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Open or in progress
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Daily Entry/Exit Logs</CardTitle>
              <CardDescription>Student movement today.</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ChartContainer config={chartConfig} className="w-full h-[350px]">
                <BarChart accessibilityLayer data={chartData}>
                  <XAxis
                    dataKey="time"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value}`}
                  />
                  <Tooltip
                    content={<ChartTooltipContent hideIndicator />}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar
                    dataKey="entries"
                    fill="var(--color-entries)"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="exits"
                    fill="var(--color-exits)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Recent Announcements</CardTitle>
              <CardDescription>
                Latest news and updates for students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoadingAnnouncements
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[250px]" />
                          <Skeleton className="h-4 w-[200px]" />
                        </div>
                      </div>
                    ))
                  : announcements?.map((ann) => (
                      <div key={ann.id} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Bell className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium leading-none">
                            {ann.title}
                          </p>
                          <p className="text-sm text-muted-foreground whitespace-normal">
                            {ann.content}
                          </p>
                        </div>
                      </div>
                    ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Recent Complaints</CardTitle>
              <CardDescription>
                Track and resolve student issues.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/complaints">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Complaint</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoadingComplaints
                  ? Array.from({ length: 5 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                  : complaints?.map((complaint) => (
                      <TableRow key={complaint.id}>
                        <TableCell>
                          <div className="font-medium">
                            {complaint.studentName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {complaint.roomNumber}
                          </div>
                        </TableCell>
                        <TableCell>{complaint.complaintText}</TableCell>
                        <TableCell>
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
                        <TableCell className="text-right">
                          {format(
                            new Date(complaint.submissionDate),
                            'MMM d, yyyy'
                          )}
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
