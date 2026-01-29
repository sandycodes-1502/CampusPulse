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
import { format } from 'date-fns';
import { useMemo, useState, useEffect } from 'react';

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
import type { Complaint, Outpass } from '@/lib/types';
import { cn } from '@/lib/utils';
import {
  students,
  rooms,
  dailyEntryExit,
} from '@/lib/data';
import { useAnnouncementsStore } from '@/hooks/use-announcements-store';
import { useComplaintsStore } from '@/hooks/use-complaints-store';
import { useOutpassesStore } from '@/hooks/use-outpasses-store';

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
  const { announcements, isLoading: isLoadingAnnouncements } = useAnnouncementsStore();
  const { complaints, isLoading: isLoadingComplaints } = useComplaintsStore();
  const { outpasses, isLoading: isLoadingOutpasses } = useOutpassesStore();
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Simulate loading for static data
  useEffect(() => {
    const timer = setTimeout(() => setIsLoadingStats(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const pendingOutpasses = useMemo(
    () => outpasses.filter((o) => o.status === 'pending'),
    [outpasses]
  );
  const activeComplaints = useMemo(
    () => complaints.filter((c) => ['open', 'in progress'].includes(c.status)),
    [complaints]
  );
  
  const recentAnnouncements = useMemo(() => announcements.slice(0, 3), [announcements]);
  const recentComplaints = useMemo(() => complaints.slice(0, 5), [complaints]);

  const roomsOccupiedCount = useMemo(() => {
    const occupiedRoomIds = new Set(
      students.map((s) => s.hostelRoomId).filter(Boolean)
    );
    return occupiedRoomIds.size;
  }, []);

  const isLoading = isLoadingStats || isLoadingAnnouncements || isLoadingComplaints || isLoadingOutpasses;

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
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">{students.length}</div>
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
              {isLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {roomsOccupiedCount} / {rooms.length}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                {`${Math.round(
                    (roomsOccupiedCount / rooms.length) * 100
                  )}% occupancy rate`}
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
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">
                  {pendingOutpasses.length}
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
              {isLoading ? (
                <Skeleton className="h-8 w-12" />
              ) : (
                <div className="text-2xl font-bold">
                  {activeComplaints.length}
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
                <BarChart accessibilityLayer data={dailyEntryExit}>
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
                  : recentAnnouncements.map((ann) => (
                      <div key={ann.id} className="flex items-start gap-4">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <Bell className="h-5 w-5 text-primary" />
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
                  : recentComplaints.map((complaint) => (
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
