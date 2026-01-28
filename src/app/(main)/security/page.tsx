'use client';

import { useState } from 'react';
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
  const [isVerifying, setIsVerifying] = useState(false);

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
      }
      setIsVerifying(false);
    }, 1000);
  };

  const handleSearchLogs = () => {
    setSearchPerformed(true);
    if (searchPrn.trim() === '') {
      handleResetSearch();
      return;
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
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
