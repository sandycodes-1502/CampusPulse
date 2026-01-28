
"use client";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock data and functions for now
const outpassRequests = [
  // 12 Approved
  {
    id: "1",
    prn: "21070122001",
    name: "Aarav Sharma",
    hostel: "A",
    roomNo: "101",
    outFrom: "2024-08-01T10:00",
    outTo: "2024-08-01T18:00",
    purpose: "Family function",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "2",
    prn: "21070122002",
    name: "Vivaan Singh",
    hostel: "B",
    roomNo: "102",
    outFrom: "2024-08-02T09:00",
    outTo: "2024-08-02T17:00",
    purpose: "Medical appointment",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "3",
    prn: "21070122003",
    name: "Aditya Kumar",
    hostel: "C",
    roomNo: "103",
    outFrom: "2024-08-03T11:00",
    outTo: "2024-08-03T19:00",
    purpose: "Local guardian visit",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "4",
    prn: "21070122004",
    name: "Vihaan Gupta",
    hostel: "A",
    roomNo: "104",
    outFrom: "2024-08-04T13:00",
    outTo: "2024-08-04T21:00",
    purpose: "Weekend outing",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "5",
    prn: "21070122005",
    name: "Arjun Patel",
    hostel: "B",
    roomNo: "201",
    outFrom: "2024-08-05T08:00",
    outTo: "2024-08-05T16:00",
    purpose: "Shopping",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "6",
    prn: "21070122006",
    name: "Sai Reddy",
    hostel: "C",
    roomNo: "202",
    outFrom: "2024-08-06T12:00",
    outTo: "2024-08-06T20:00",
    purpose: "Movie with friends",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "7",
    prn: "21070122007",
    name: "Krishna Yadav",
    hostel: "A",
    roomNo: "203",
    outFrom: "2024-08-07T14:00",
    outTo: "2024-08-07T22:00",
    purpose: "Attend a workshop",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "8",
    prn: "21070122008",
    name: "Ishaan Jain",
    hostel: "B",
    roomNo: "301",
    outFrom: "2024-08-08T10:00",
    outTo: "2024-08-09T18:00",
    purpose: "Visit home for 2 days",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "9",
    prn: "21070122009",
    name: "Diya Mehta",
    hostel: "D",
    roomNo: "101",
    outFrom: "2024-08-09T09:30",
    outTo: "2024-08-09T17:30",
    purpose: "Library visit",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "10",
    prn: "21070122010",
    name: "Arya Agarwal",
    hostel: "D",
    roomNo: "102",
    outFrom: "2024-08-10T11:30",
    outTo: "2024-08-10T19:30",
    purpose: "Dinner with family",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "11",
    prn: "21070122011",
    name: "Ananya Joshi",
    hostel: "E",
    roomNo: "201",
    outFrom: "2024-08-11T15:00",
    outTo: "2024-08-11T23:00",
    purpose: "Attend a concert",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  {
    id: "12",
    prn: "21070122012",
    name: "Myra Desai",
    hostel: "E",
    roomNo: "202",
    outFrom: "2024-08-12T08:00",
    outTo: "2024-08-12T12:00",
    purpose: "Bank work",
    status: "approved",
    mailScreenshotUrl: "#",
  },
  // 8 Rejected
  {
    id: "13",
    prn: "21070122013",
    name: "Reyansh Tiwari",
    hostel: "A",
    roomNo: "301",
    outFrom: "2024-08-13T10:00",
    outTo: "2024-08-13T18:00",
    purpose: "Going to the mall",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "14",
    prn: "21070122014",
    name: "Ayaan Khan",
    hostel: "B",
    roomNo: "302",
    outFrom: "2024-08-14T12:00",
    outTo: "2024-08-14T20:00",
    purpose: "Meeting friends",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "15",
    prn: "21070122015",
    name: "Advik Verma",
    hostel: "C",
    roomNo: "303",
    outFrom: "2024-08-15T16:00",
    outTo: "2024-08-15T23:00",
    purpose: "Late night movie",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "16",
    prn: "21070122016",
    name: "Kabir Sharma",
    hostel: "A",
    roomNo: "401",
    outFrom: "2024-08-16T09:00",
    outTo: "2024-08-16T17:00",
    purpose: "No clear reason",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "17",
    prn: "21070122017",
    name: "Anika Singh",
    hostel: "D",
    roomNo: "301",
    outFrom: "2024-08-17T11:00",
    outTo: "2024-08-17T15:00",
    purpose: "Just roaming around",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "18",
    prn: "21070122018",
    name: "Saanvi Gupta",
    hostel: "D",
    roomNo: "302",
    outFrom: "2024-08-18T13:00",
    outTo: "2024-08-18T21:00",
    purpose: "Not specified",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "19",
    prn: "21070122019",
    name: "Kiara Patel",
    hostel: "E",
    roomNo: "401",
    outFrom: "2024-08-19T10:00",
    outTo: "2024-08-20T18:00",
    purpose: "Extended outing without approval",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
  {
    id: "20",
    prn: "21070122020",
    name: "Zara Reddy",
    hostel: "E",
    roomNo: "402",
    outFrom: "2024-08-20T17:00",
    outTo: "2024-08-20T23:59",
    purpose: "Late night party",
    status: "rejected",
    mailScreenshotUrl: "#",
  },
    // 5 Pending
  {
    id: "21",
    prn: "21070122021",
    name: "Rohan Dubey",
    hostel: "F",
    roomNo: "101",
    outFrom: "2024-08-21T09:00",
    outTo: "2024-08-21T17:00",
    purpose: "Project submission",
    status: "pending",
    mailScreenshotUrl: "#",
  },
  {
    id: "22",
    prn: "21070122022",
    name: "Sonia Kapoor",
    hostel: "G",
    roomNo: "102",
    outFrom: "2024-08-22T10:00",
    outTo: "2024-08-22T18:00",
    purpose: "Visit local market",
    status: "pending",
    mailScreenshotUrl: "#",
  },
  {
    id: "23",
    prn: "21070122023",
    name: "Karan Malhotra",
    hostel: "F",
    roomNo: "201",
    outFrom: "2024-08-23T11:00",
    outTo: "2024-08-23T19:00",
    purpose: "Sports event",
    status: "pending",
    mailScreenshotUrl: "#",
  },
  {
    id: "24",
    prn: "21070122024",
    name: "Priya Nair",
    hostel: "G",
    roomNo: "202",
    outFrom: "2024-08-24T12:00",
    outTo: "2024-08-24T20:00",
    purpose: "Group study session",
    status: "pending",
    mailScreenshotUrl: "#",
  },
  {
    id: "25",
    prn: "21070122025",
    name: "Amit Kumar",
    hostel: "F",
    roomNo: "301",
    outFrom: "2024-08-25T13:00",
    outTo: "2024-08-25T21:00",
    purpose: "Personal errand",
    status: "pending",
    mailScreenshotUrl: "#",
  },
];

const OutpassRequestForm = () => {
  const formSchema = z.object({
    prn: z.string().min(1, "PRN is required"),
    name: z.string().min(1, "Name is required"),
    year: z.enum(["FY", "SY", "TY", "Final Year"]),
    institute: z.string().min(1, "Institute is required"),
    hostel: z.string().min(1, "Hostel is required"),
    roomNo: z.string().min(1, "Room No. is required"),
    outFrom: z.string().min(1, "Outpass From date and time are required"),
    outTo: z.string().min(1, "Outpass To date and time are required"),
    purpose: z.string().min(1, "Purpose is required"),
    screenshot: z.any().refine((file) => file, "Screenshot is required."),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prn: "",
      name: "",
      institute: "Symbiosis Institute of Technology, Pune",
      hostel: "",
      roomNo: "",
      outFrom: "",
      outTo: "",
      purpose: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted", values);
    // TODO: 
    // 1. Upload screenshot to Firebase Storage
    // 2. Get the download URL
    // 3. Save the form data (including the URL) to Firestore "outpasses" collection
    // 4. Include studentId (from Firebase Auth) and createdAt timestamp
    alert("Outpass request submitted successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Digital Outpass Request</CardTitle>
        <CardDescription>
          Fill out the form to request a new outpass.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PRN</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your PRN" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="FY">FY</SelectItem>
                        <SelectItem value="SY">SY</SelectItem>
                        <SelectItem value="TY">TY</SelectItem>
                        <SelectItem value="Final Year">Final Year</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="institute"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Institute</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hostel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hostel</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., A, B, C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="roomNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Room No.</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outFrom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outpass From</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="outTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Outpass To</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purpose</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Briefly describe the purpose of your outpass"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="screenshot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload screenshot of approval mail</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit Request</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

const AdminOutpassView = () => {

  const handleApprove = (id: string) => {
    console.log("Approved:", id)
    // TODO: 
    // 1. Update status to "approved" in Firestore
    // 2. Save approvedAt timestamp and approvedBy (admin/warden)
    // 3. Trigger Cloud Function to generate PDF and send email
  }

  const handleReject = (id: string) => {
    console.log("Rejected:", id)
    // TODO:
    // 1. Update status to "rejected" in Firestore
    // 2. Optionally save rejectionReason
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin / Warden View</CardTitle>
        <CardDescription>
          Review and approve or reject outpass requests.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PRN</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Hostel & Room</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Screenshot</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {outpassRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.prn}</TableCell>
                <TableCell>{request.name}</TableCell>
                <TableCell>
                  {request.hostel} - {request.roomNo}
                </TableCell>
                <TableCell>
                  {new Date(request.outFrom).toLocaleString()} →{" "}
                  {new Date(request.outTo).toLocaleString()}
                </TableCell>
                <TableCell>{request.purpose}</TableCell>
                <TableCell>
                  <a
                    href={request.mailScreenshotUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                </TableCell>
                <TableCell>
                  <Badge
                    className={`
                      ${request.status === "approved" && "bg-green-500"}
                      ${request.status === "rejected" && "bg-red-500"}
                      ${request.status === "pending" && "bg-yellow-500"}
                      text-white
                    `}
                  >
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={() => handleApprove(request.id)}>✅ Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                        ❌ Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default function OutpassPage() {
  return (
    <>
      <PageHeader title="Digital Outpass" />
      <div className="container mx-auto py-10">
        <Tabs defaultValue="student">
          <TabsList>
            <TabsTrigger value="student">Student Request</TabsTrigger>
            <TabsTrigger value="admin">Admin View</TabsTrigger>
          </TabsList>
          <TabsContent value="student">
            <OutpassRequestForm />
          </TabsContent>
          <TabsContent value="admin">
            <AdminOutpassView />
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
