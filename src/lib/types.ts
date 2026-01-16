export type Announcement = {
  id: string;
  title: string;
  content: string;
  date: string;
};

export type Complaint = {
  id: string;
  studentName: string;
  roomNumber: string;
  category: 'Maintenance' | 'Security' | 'Cleaning' | 'Other';
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
};

export type Feedback = {
  id: string;
  feedback: string;
  category: 'Hostel' | 'College';
  date: string;
};
