'use client';

import { useState } from 'react';
import {
  collectionGroup,
  doc,
  addDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  collection,
  documentId,
} from 'firebase/firestore';
import {
  QrCode,
  Search,
  LogOut,
  LogIn,
  CheckCircle,
  XCircle,
  Clock,
  UserCheck,
} from 'lucide-react';
import { format } from 'date-fns';

import { useFirestore, useUser } from '@/firebase';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
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
<<<<<<< HEAD
import {
  QrCode,
  Search,
  LogIn,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';

// Mock data for Verify Outpass Tab
const outpassRequests = [
  {
    id: "1",
    prn: "21070122001",
    name: "Aarav Sharma",
    year: "TY",
    institute: "Symbiosis Institute of Technology, Pune",
    hostel: "A",
    roomNo: "101",
    outFrom: "2024-08-01T10:00",
    outTo: "2024-08-01T18:00",
    purpose: "Family function",
    status: "approved",
    mailScreenshotUrl: "#",
    approvedBy: "Mr. Ramesh",
    approvedAt: "2024-07-31T14:00",
  },
  {
    id: "13",
    prn: "21070122013",
    name: "Reyansh Tiwari",
    year: "SY",
    institute: "Symbiosis Institute of Technology, Pune",
    hostel: "A",
    roomNo: "301",
    outFrom: "2024-08-13T10:00",
    outTo: "2024-08-13T18:00",
    purpose: "Going to the mall",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
];

type OutpassData = (typeof outpassRequests)[0];
type VerificationResult = OutpassData | { status: 'rejected' | 'not_found' };

// Enhanced mock data for Entry/Exit Log Tab (approx. 100 students)
const generateEntryExitLogs = () => {
  const logs = [];
  const students = Array.from({ length: 100 }, (_, i) => {
    const prnId = String(i + 1).padStart(3, '0');
    return {
      prn: `22070122${prnId}`,
      name: `Student ${prnId}`,
      hostel: ['A', 'B', 'C', 'D', 'E', 'F', 'G'][i % 7],
      roomNo: `${(i % 5) + 1}0${i % 10}`,
    };
  });

  const now = new Date();
  students.forEach(student => {
    const numLogs = Math.floor(Math.random() * 8) + 2; // 2-10 logs per student
    for (let i = 0; i < numLogs; i++) {
      const daysAgo = Math.random() * 365; // Up to 1 year ago
      const timestamp = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
      logs.push({
        ...student,
        action: Math.random() > 0.5 ? 'ENTRY' : 'EXIT',
        timestamp,
        verifiedBy: `Guard${Math.floor(Math.random() * 4) + 1}`,
      });
    }
  });

  return logs;
};

const entryExitLogs = generateEntryExitLogs();

export default function SecurityPage() {
  // States for Verify Outpass tab
  const [prn, setPrn] = useState('');
  const [verificationResult, setVerificationResult] =
    useState<VerificationResult | null>(null);
=======
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Outpass, EntryExitLog } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { updateDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { useCollection, useMemoFirebase } from '@/firebase';

type OutpassVerificationResult = (Outpass & { id: string }) | { status: 'Not Found' | 'Not Approved' | 'Used' | 'Rejected' };

function OutpassVerification() {
  const firestore = useFirestore();
  const { toast } = useToast();
  const [outpassId, setOutpassId] = useState('');
>>>>>>> 1bce9a085911f85826f019179c767ebab116ce61
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<OutpassVerificationResult | null>(null);

<<<<<<< HEAD
  // States for Entry/Exit Log tab
  const [allLogs] = useState(() => entryExitLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  const [displayLogs, setDisplayLogs] = useState(allLogs);
  const [searchPrn, setSearchPrn] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleVerify = () => {
    if (!prn) return;
    setIsVerifying(true);
    setVerificationResult(null);
    setTimeout(() => {
      const result = outpassRequests.find((req) => req.prn === prn);
      if (result) {
        setVerificationResult(result);
      } else {
        setVerificationResult({ status: 'not_found' });
=======
  const approvedOutpassesQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collectionGroup(firestore, 'outpasses'),
      where('status', '==', 'approved'),
      orderBy('departureDateTime', 'desc')
    );
  }, [firestore]);

  const { data: approvedOutpasses, isLoading: isLoadingOutpasses } = useCollection<Outpass>(approvedOutpassesQuery);

  const handleVerify = async () => {
    if (!outpassId || !firestore) return;
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const q = query(collectionGroup(firestore, 'outpasses'), where(documentId(), '==', outpassId), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setVerificationResult({ status: 'Not Found' });
      } else {
        const outpassDoc = querySnapshot.docs[0];
        const outpass = { id: outpassDoc.id, ...outpassDoc.data() } as Outpass;
        if (outpass.status === 'approved') {
          setVerificationResult(outpass);
        } else {
          setVerificationResult({ status: outpass.status as 'Not Approved' | 'Used' | 'Rejected' });
        }
>>>>>>> 1bce9a085911f85826f019179c767ebab116ce61
      }
    } catch (e) {
      console.error(e);
      setVerificationResult({ status: 'Not Found' });
      toast({ title: 'Error verifying outpass', variant: 'destructive' });
    } finally {
      setIsVerifying(false);
<<<<<<< HEAD
    }, 1000);
  };

  const handleSearchLogs = () => {
    setSearchPerformed(true);
    if (searchPrn.trim() === '') {
      handleResetSearch();
      return;
=======
>>>>>>> 1bce9a085911f85826f019179c767ebab116ce61
    }
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const filtered = allLogs
      .filter(
        (log) =>
          log.prn === searchPrn.trim() && log.timestamp >= oneYearAgo
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()); // Chronological
    setDisplayLogs(filtered);
  };
  
  const handleResetSearch = () => {
      setSearchPrn('');
      setDisplayLogs(allLogs);
      setSearchPerformed(false);
  }

  const handleMarkAsUsed = (outpass: Outpass) => {
    if (!firestore || !outpass.studentId) return;
    const outpassRef = doc(firestore, 'users', outpass.studentId, 'outpasses', outpass.id);
    updateDocumentNonBlocking(outpassRef, { status: 'used' });
    toast({ title: 'Outpass marked as used.' });
    setVerificationResult(null);
    setOutpassId('');
  };
  
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Verify Digital Outpass</CardTitle>
          <CardDescription>
            Enter the Outpass ID to verify its authenticity.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Input
              type="text"
              placeholder="Enter Outpass ID"
              value={outpassId}
              onChange={(e) => setOutpassId(e.target.value)}
              disabled={isVerifying}
            />
            <Button
              onClick={handleVerify}
              disabled={isVerifying || !outpassId}
            >
              {isVerifying ? 'Verifying...' : <Search className="mr-2 h-4 w-4" />}
              Verify
            </Button>
          </div>
          {verificationResult && (
            <Card className="mt-4 bg-muted/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {'studentName' in verificationResult ? (
                    <CheckCircle className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                  Verification Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                {'studentName' in verificationResult ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Avatar className="h-24 w-24 border">
                        <AvatarFallback>
                          {verificationResult.studentName.split(' ').map((n) => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid gap-1.5">
                        <p className="font-semibold text-lg">{verificationResult.studentName}</p>
                        <p className="text-sm text-muted-foreground">ID: {verificationResult.studentId} | Room: {verificationResult.roomNumber}</p>
                        <p className="text-sm">Destination: {verificationResult.reason}</p>
                        <p className="text-sm flex items-center gap-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {format(new Date(verificationResult.departureDateTime), 'p, dd MMM')} - {format(new Date(verificationResult.returnDateTime), 'p, dd MMM')}
                          </span>
                        </p>
                        <Badge className="w-fit bg-green-100 text-green-800 hover:bg-green-200">Valid & Approved</Badge>
                      </div>
                    </div>
                    <Button className="w-full" onClick={() => handleMarkAsUsed(verificationResult)}>
                      <UserCheck className="mr-2 h-4 w-4" />
                      Mark as Used
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="font-semibold text-red-500 capitalize">{verificationResult.status}</p>
                    <p className="text-sm text-muted-foreground">This outpass is not valid for use.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Active Approved Outpasses</CardTitle>
          <CardDescription>
            List of students currently on an approved outpass.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Return Time</TableHead>
                <TableHead className='text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingOutpasses ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className='text-right'><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : approvedOutpasses?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">No approved outpasses.</TableCell>
                </TableRow>
              ) : (
                approvedOutpasses?.map((outpass) => (
                  <TableRow key={outpass.id}>
                    <TableCell>
                      <div className="font-medium">{outpass.studentName}</div>
                      <div className="text-sm text-muted-foreground">{outpass.studentId}</div>
                    </TableCell>
                    <TableCell>{format(new Date(outpass.returnDateTime), 'p, dd MMM')}</TableCell>
                    <TableCell className='text-right'>
                      <Button variant="outline" size="sm" onClick={() => handleMarkAsUsed(outpass)}>Mark Used</Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

function EntryExitLogging() {
  const firestore = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();

  const logsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'entry_exit_logs'), orderBy('dateTime', 'desc'), limit(10));
  }, [firestore]);

  const { data: logs, isLoading: isLoadingLogs } = useCollection<EntryExitLog>(logsQuery);

  const handleManualLog = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore || !user) return;

    const formData = new FormData(event.currentTarget);
    const studentId = formData.get('studentId') as string;
    const type = formData.get('logType') as 'entry' | 'exit';

    if (studentId && type) {
      addDocumentNonBlocking(collection(firestore, 'entry_exit_logs'), {
        studentId,
        type,
        dateTime: serverTimestamp(),
        recordedBySecurityId: user.uid,
      });
      toast({ title: 'Log recorded successfully.' });
      (event.target as HTMLFormElement).reset();
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Recent Entry/Exit Logs</CardTitle>
          <CardDescription>
            Showing the 10 most recent student entries and exits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoadingLogs ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    <TableCell className="text-center"><Skeleton className="h-6 w-16 mx-auto" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : logs?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">No logs recorded yet.</TableCell>
                </TableRow>
              ) : (
                logs?.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="font-medium">{log.studentId}</div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={log.type === 'entry' ? 'secondary' : 'outline'}
                        className={log.type === 'entry' ? 'text-green-800 bg-green-100' : 'text-orange-800 bg-orange-100'}
                      >
                        {log.type === 'entry' ? <LogIn className="mr-1 h-3 w-3" /> : <LogOut className="mr-1 h-3 w-3" />}
                        {log.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.dateTime ? format(new Date(log.dateTime.seconds * 1000), 'p') : 'Just now'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Manual Log Entry</CardTitle>
          <CardDescription>Manually record a student's entry or exit.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleManualLog} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID</Label>
              <Input id="studentId" name="studentId" placeholder="Enter Student ID" required />
            </div>
            <div className="space-y-2">
              <Label>Log Type</Label>
              <RadioGroup name="logType" defaultValue="entry" className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="entry" id="entry" />
                  <Label htmlFor="entry">Entry</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="exit" id="exit" />
                  <Label htmlFor="exit">Exit</Label>
                </div>
              </RadioGroup>
            </div>
            <Button type="submit" className="w-full">Record Log</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SecurityPage() {
  return (
    <>
      <PageHeader title="Security Desk" />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <Tabs defaultValue="log" className="w-full">
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
<<<<<<< HEAD
            <Card>
              <CardHeader>
                <CardTitle>Verify Digital Outpass</CardTitle>
                <CardDescription>
                  Enter the student's PRN to verify the outpass.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex w-full max-w-sm items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Enter PRN..."
                    value={prn}
                    onChange={(e) => setPrn(e.target.value)}
                    disabled={isVerifying}
                  />
                  <Button
                    onClick={handleVerify}
                    disabled={isVerifying || !prn}
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
                  <Card className="mt-4">
                    <CardHeader>
                      {verificationResult.status === 'approved' && (
                        <CardTitle className="flex items-center gap-2 text-green-600">
                          <CheckCircle className="h-6 w-6" />
                          OUTPASS VALID / APPROVED
                        </CardTitle>
                      )}
                      {verificationResult.status === 'rejected' && (
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <XCircle className="h-6 w-6" />
                          OUTPASS REJECTED
                        </CardTitle>
                      )}
                      {verificationResult.status === 'not_found' && (
                        <CardTitle className="flex items-center gap-2 text-red-600">
                          <AlertTriangle className="h-6 w-6" />
                          FAKE OUTPASS
                        </CardTitle>
                      )}
                    </CardHeader>
                    <CardContent>
                      {verificationResult.status === 'approved' &&
                        'prn' in verificationResult && (
                          <div className="grid gap-4 md:grid-cols-2">
                            <div className="grid gap-1">
                              <p className="font-semibold">
                                {verificationResult.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                PRN: {verificationResult.prn}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {verificationResult.year} - {' '}
                                {verificationResult.institute}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Hostel: {verificationResult.hostel}, Room: {' '}
                                {verificationResult.roomNo}
                              </p>
                            </div>
                            <div className="grid gap-1">
                              <p className="font-semibold">Duration</p>
                              <p>
                                {new Date(
                                  verificationResult.outFrom
                                ).toLocaleString()}{' '}
                                →{' '}
                                {new Date(
                                  verificationResult.outTo
                                ).toLocaleString()}
                              </p>
                              <p className="font-semibold mt-2">Purpose</p>
                              <p>{verificationResult.purpose}</p>
                            </div>
                            <div className="md:col-span-2 grid gap-1">
                              <p className="font-semibold">Approval Details</p>
                              <p>
                                Approved by: {verificationResult.approvedBy}
                              </p>
                              <p>
                                Approved at: {' '}
                                {new Date(
                                  verificationResult.approvedAt!
                                ).toLocaleString()}
                              </p>
                              <Button
                                asChild
                                variant="secondary"
                                className="mt-2 w-fit"
                              >
                                <a
                                  href={verificationResult.mailScreenshotUrl}
                                  target="_blank"
                                >
                                  View Admin Approved Official Outpass
                                </a>
                              </Button>
                            </div>
                          </div>
                        )}
                      {verificationResult.status === 'not_found' && (
                        <p className="text-red-600">
                          No approved outpass found for this PRN.
                        </p>
                      )}
                      {verificationResult.status === 'rejected' && (
                        <p className="text-red-600">
                          The outpass for this PRN was rejected.
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="log">
            <Card>
              <CardHeader>
                <CardTitle>Entry / Exit Log</CardTitle>
                <CardDescription>
                  View all student entries and exits. Search by PRN for a 1-year
                  history.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex w-full max-w-md items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Search by PRN..."
                    value={searchPrn}
                    onChange={(e) => setSearchPrn(e.target.value)}
                     onKeyDown={(e) => e.key === 'Enter' && handleSearchLogs()}
                  />
                  <Button onClick={handleSearchLogs}>
                    <Search className="mr-2 h-4 w-4" /> Search
                  </Button>
                  <Button variant="outline" onClick={handleResetSearch}>Reset</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>PRN</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Hostel & Room</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {displayLogs.length > 0 ? (
                      displayLogs.map((log, index) => (
                        <TableRow key={index}>
                          <TableCell>{log.prn}</TableCell>
                          <TableCell>{log.name}</TableCell>
                          <TableCell>{`${log.hostel} - ${log.roomNo}`}</TableCell>
                          <TableCell>
                            <Badge
                              className={
                                log.action === 'ENTRY'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-blue-100 text-blue-800'
                              }
                            >
                              {log.action}
                            </Badge>
                          </TableCell>
                          <TableCell>{format(log.timestamp, 'PPP')}</TableCell>
                          <TableCell>{format(log.timestamp, 'p')}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                     searchPerformed && <TableRow>
                        <TableCell colSpan={6} className="text-center h-24">
                          No entry/exit records found for this PRN.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
=======
            <OutpassVerification />
          </TabsContent>
          <TabsContent value="log">
            <EntryExitLogging />
>>>>>>> 1bce9a085911f85826f019179c767ebab116ce61
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
    