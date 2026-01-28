'use client';

import { useState } from 'react';
import {
  collectionGroup,
  doc,
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

import { useFirestore } from '@/firebase';
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
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<OutpassVerificationResult | null>(null);

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
      }
    } catch (e) {
      console.error(e);
      setVerificationResult({ status: 'Not Found' });
      toast({ title: 'Error verifying outpass', variant: 'destructive' });
    } finally {
      setIsVerifying(false);
    }
  };
  
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
  const { toast } = useToast();

  const logsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'entry_exit_logs'), orderBy('dateTime', 'desc'), limit(10));
  }, [firestore]);

  const { data: logs, isLoading: isLoadingLogs } = useCollection<EntryExitLog>(logsQuery);

  const handleManualLog = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firestore) return;

    const formData = new FormData(event.currentTarget);
    const studentId = formData.get('studentId') as string;
    const type = formData.get('logType') as 'entry' | 'exit';

    if (studentId && type) {
      addDocumentNonBlocking(collection(firestore, 'entry_exit_logs'), {
        studentId,
        type,
        dateTime: serverTimestamp(),
        recordedBySecurityId: 'security_desk', // Hardcoded as auth is removed
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
            <OutpassVerification />
          </TabsContent>
          <TabsContent value="log">
            <EntryExitLogging />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
