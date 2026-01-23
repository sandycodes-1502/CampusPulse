export type Outpass = {
  id: string;
  studentName: string;
  studentId: string;
  roomNumber: string;
  destination: string;
  reason: string;
  dateFrom: string;
  dateTo: string;
  status: 'Pending' | 'Approved' | 'Rejected';
};

export const outpasses: Outpass[] = [
  {
    id: 'OP001',
    studentName: 'Rohan Mehra',
    studentId: 'STU101',
    roomNumber: 'A-301',
    destination: 'Home',
    reason: 'Family function',
    dateFrom: '2024-05-25',
    dateTo: '2024-05-28',
    status: 'Approved',
  },
  {
    id: 'OP002',
    studentName: 'Sneha Reddy',
    studentId: 'STU102',
    roomNumber: 'B-204',
    destination: 'Local Guardian',
    reason: 'Weekend stay',
    dateFrom: '2024-05-26',
    dateTo: '2024-05-27',
    status: 'Pending',
  },
  {
    id: 'OP003',
    studentName: 'Karan Malhotra',
    studentId: 'STU103',
    roomNumber: 'C-110',
    destination: 'City',
    reason: 'Medical appointment',
    dateFrom: '2024-05-27',
    dateTo: '2024-05-27',
    status: 'Pending',
  },
  {
    id: 'OP004',
    studentName: 'Anjali Desai',
    studentId: 'STU104',
    roomNumber: 'A-405',
    destination: 'Home',
    reason: 'Personal emergency',
    dateFrom: '2024-05-24',
    dateTo: '2024-05-29',
    status: 'Rejected',
  },
  {
    id: 'OP005',
    studentName: 'Vikram Rathore',
    studentId: 'STU105',
    roomNumber: 'B-101',
    destination: 'City',
    reason: 'Attending a workshop',
    dateFrom: '2024-05-28',
    dateTo: '2024-05-28',
    status: 'Approved',
  },
];
