
export type Announcement = {
  id: string;
  title: string;
  content: string;
  postDate: string;
  adminId: string;
};

export type Complaint = {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber?: string;
  complaintText: string;
  submissionDate: string;
  status: 'open' | 'in progress' | 'resolved';
  adminId?: string;
};

export type Feedback = {
  id: string;
  studentId: string;
  studentName: string;
  feedbackText: string;
  submissionDate: string;
  category: 'Hostel' | 'College';
};

export type Outpass = {
  id: string;
  studentId: string;
  studentName: string;
  roomNumber: string;
  reason: string;
  fromDate: string;
  toDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'used';
  approvedBySecurityId?: string;
};

export type Fee = {
  id: string;
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  paymentDate?: string;
  status: 'paid' | 'unpaid' | 'overdue';
};

export type Room = {
  id: string;
  roomNumber: string;
  capacity: number;
  availability: boolean;
};

export type Student = {
    id: string;
    userId: string;
    name: string;
    email: string;
    hostelRoomId?: string;
    major?: string;
};

export type EntryExitLog = {
    id: string;
    studentId: string;
    dateTime: string;
    type: 'entry' | 'exit';
    recordedBySecurityId: string;
};
