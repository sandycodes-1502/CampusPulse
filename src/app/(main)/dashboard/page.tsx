import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  Users,
  BedDouble,
  Ticket,
  FilePenLine,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

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
import { ChartTooltipContent } from '@/components/ui/chart';
import { announcements, complaints } from '@/lib/data';

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

export default function DashboardPage() {
  return (
    <>
      <PageHeader title="Dashboard" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rooms Occupied</CardTitle>
              <BedDouble className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">480 / 500</div>
              <p className="text-xs text-muted-foreground">96% occupancy rate</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Outpasses</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+5 since yesterday</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Complaints</CardTitle>
              <FilePenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">2 resolved today</p>
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
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
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
                    content={<ChartTooltipContent />}
                    cursor={{ fill: 'hsl(var(--muted))' }}
                  />
                  <Bar dataKey="entries" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} name="Entries" />
                  <Bar dataKey="exits" fill="hsl(var(--chart-5))" radius={[4, 4, 0, 0]} name="Exits" />
                </BarChart>
              </ResponsiveContainer>
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
                {announcements.map((ann) => (
                  <div key={ann.id} className="flex items-start gap-4">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Bell className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{ann.title}</p>
                      <p className="text-sm text-muted-foreground truncate">{ann.content}</p>
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
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {complaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>
                      <div className="font-medium">{complaint.studentName}</div>
                      <div className="text-sm text-muted-foreground">
                        {complaint.roomNumber}
                      </div>
                    </TableCell>
                    <TableCell>{complaint.category}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={complaint.status === 'Resolved' ? 'default' : complaint.status === 'In Progress' ? 'secondary' : 'destructive'}
                        className={complaint.status === 'Resolved' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {complaint.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{complaint.date}</TableCell>
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
