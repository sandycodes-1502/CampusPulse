export type Fee = {
  studentId: string;
  studentName: string;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
};

export const fees: Fee[] = [
  {
    studentId: 'STU001',
    studentName: 'John Doe',
    amount: 500,
    dueDate: '2024-08-15',
    status: 'Paid',
  },
  {
    studentId: 'STU002',
    studentName: 'Jane Smith',
    amount: 500,
    dueDate: '2024-08-15',
    status: 'Unpaid',
  },
  {
    studentId: 'STU003',
    studentName: 'Peter Jones',
    amount: 500,
    dueDate: '2024-07-15',
    status: 'Overdue',
  },
  {
    studentId: 'STU004',
    studentName: 'Mary Johnson',
    amount: 500,
    dueDate: '2024-08-15',
    status: 'Paid',
  },
  {
    studentId: 'STU005',
    studentName: 'David Williams',
    amount: 500,
    dueDate: '2024-08-15',
    status: 'Unpaid',
  },
];