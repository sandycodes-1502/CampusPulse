'use client';

import { useState } from 'react';
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
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  QrCode,
  Search,
  LogOut,
  LogIn,
  CheckCircle,
  XCircle,
  Clock,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { format } from 'date-fns';

type OutpassData = {
  studentName: string;
  studentId: string;
  roomNumber: string;
  avatarUrl: string;
  validFrom: string;
  validTo: string;
  destination: string;
  reason: string;
  status: 'Valid';
};

type VerificationResult = OutpassData | { status: 'Not Found' };

const mockLogs = [
  {
    id: '1',
    studentName: 'Amit Gupta',
    studentId: 'STU123',
    type: 'Exit' as 'Entry' | 'Exit',
    timestamp: new Date(),
  },
  {
    id: '2',
    studentName: 'Sunita Sharma',
    studentId: 'STU456',
    type: 'Entry' as 'Entry' | 'Exit',
    timestamp: new Date(new Date().getTime() - 30 * 60 * 1000),
  },
  {
    id: '3',
    studentName: 'Rajesh Kumar',
    studentId: 'STU789',
    type: 'Exit' as 'Entry' | 'Exit',
    timestamp: new Date(new Date().getTime() - 60 * 60 * 1000),
  },
];

const mockOutpassData: { [key: string]: OutpassData } = {
  'OP-12345': {
    studentName: 'Priya Patel',
    studentId: 'STU987',
    roomNumber: 'C-301',
    avatarUrl: 'https://picsum.photos/seed/priya/100/100',
    validFrom: new Date().toISOString(),
    validTo: new Date(new Date().getTime() + 8 * 60 * 60 * 1000).toISOString(),
    destination: 'City Library',
    reason: 'Group study for exam',
    status: 'Valid',
  },
};

export default function SecurityPage() {
  const [logs, setLogs] = useState(mockLogs);
  const [outpassId, setOutpassId] = useState('');
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = () => {
    if (!outpassId) return;
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      const result = mockOutpassData[outpassId.toUpperCase()];
      if (result) {
        setVerificationResult(result);
      } else {
        setVerificationResult({ status: 'Not Found' });
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleManualLog = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const studentId = formData.get('studentId') as string;
    const type = formData.get('logType') as 'Entry' | 'Exit';

    if (studentId && type) {
      const newLog = {
        id: `${logs.length + 1}`,
        studentName: `Student ${studentId.slice(-3)}`, // Mock name
        studentId: studentId,
        type: type,
        timestamp: new Date(),
      };
      setLogs([newLog, ...logs]);
      event.currentTarget.reset();
    }
  };

  return (
    <>
      <PageHeader title="Security Desk" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="verify" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="verify">
              <QrCode className="mr-2 h-4 w-4" />
              Verify Outpass
            </TabsTrigger>
            <TabsTrigger value="log">
              <LogIn className="mr-2 h-4 w-4" />
              Entry/Exit Log
            </TabsTrigger>
          </TabsList>
          <TabsContent value="verify">
            <Card>
              <CardHeader>
                <CardTitle>Verify Digital Outpass</CardTitle>
                <CardDescription>
                  Scan the QR code or enter the Outpass ID to verify its
                  authenticity.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter Outpass ID (e.g., OP-12345)"
                    value={outpassId}
                    onChange={(e) => setOutpassId(e.target.value)}
                    disabled={isVerifying}
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying || !outpassId}
                  >
                    {isVerifying ? (
                      'Verifying...'
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" /> Verify
                      </>
                    )}
                  </Button>
                </div>
                {verificationResult && (
                  <Card className="mt-4 bg-muted/30">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {verificationResult.status === 'Valid' ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-500" />
                        )}
                        Verification Result
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {verificationResult.status === 'Valid' ? (
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          <Avatar className="h-24 w-24 border">
                            <AvatarImage
                              src={verificationResult.avatarUrl}
                              alt={verificationResult.studentName}
                            />
                            <AvatarFallback>
                              {verificationResult.studentName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid gap-1.5">
                            <p className="font-semibold text-lg">
                              {verificationResult.studentName}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ID: {verificationResult.studentId} | Room:{' '}
                              {verificationResult.roomNumber}
                            </p>
                            <p className="text-sm">
                              Destination: {verificationResult.destination}
                            </p>
                            <p className="text-sm flex items-center gap-1">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>
                                Valid from{' '}
                                {format(new Date(verificationResult.validFrom), 'p')}{' '}
                                to{' '}
                                {format(new Date(verificationResult.validTo), 'p')}
                              </span>
                            </p>
                            <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-200">
                              Valid Outpass
                            </Badge>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <p className="font-semibold text-red-500">
                            Outpass ID Not Found
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Please check the ID and try again.
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="log">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Today's Log</CardTitle>
                  <CardDescription>
                    Showing all student entries and exits for today.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Student</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <div className="font-medium">{log.studentName}</div>
                            <div className="text-sm text-muted-foreground">
                              {log.studentId}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant={
                                log.type === 'Entry' ? 'secondary' : 'outline'
                              }
                              className={`
                                ${
                                  log.type === 'Entry'
                                    ? 'text-green-800 bg-green-100'
                                    : 'text-orange-800 bg-orange-100'
                                }
                              `}
                            >
                              {log.type === 'Entry' ? (
                                <LogIn className="mr-1 h-3 w-3" />
                              ) : (
                                <LogOut className="mr-1 h-3 w-3" />
                              )}
                              {log.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {format(log.timestamp, 'p')}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Manual Log Entry</CardTitle>
                  <CardDescription>
                    Manually record a student's entry or exit.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleManualLog} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="studentId">Student ID</Label>
                      <Input
                        id="studentId"
                        name="studentId"
                        placeholder="Enter Student ID"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Log Type</Label>
                      <RadioGroup
                        name="logType"
                        defaultValue="Entry"
                        className="flex gap-4 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Entry" id="entry" />
                          <Label htmlFor="entry">Entry</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Exit" id="exit" />
                          <Label htmlFor="exit">Exit</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button type="submit" className="w-full">
                      Record Log
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
