export type Room = {
  roomNumber: string;
  studentName: string;
  studentId: string;
  status: 'Occupied' | 'Vacant';
};

export const rooms: Room[] = [
  {
    roomNumber: 'A101',
    studentName: 'John Doe',
    studentId: 'STU001',
    status: 'Occupied',
  },
  {
    roomNumber: 'A102',
    studentName: 'Jane Smith',
    studentId: 'STU002',
    status: 'Occupied',
  },
  {
    roomNumber: 'A103',
    studentName: 'Peter Jones',
    studentId: 'STU003',
    status: 'Occupied',
  },
  {
    roomNumber: 'A104',
    studentName: '',
    studentId: '',
    status: 'Vacant',
  },
  {
    roomNumber: 'B101',
    studentName: 'Mary Johnson',
    studentId: 'STU004',
    status: 'Occupied',
  },
  {
    roomNumber: 'B102',
    studentName: 'David Williams',
    studentId: 'STU005',
    status: 'Occupied',
  },
];