import type { Student, Room, Announcement, Complaint, Fee, EntryExitLog } from './types';
import { subDays, formatISO } from 'date-fns';

export const students: Student[] = [
    { id: 'student01', userId: 'user01', name: 'Alice Johnson', email: 'alice@example.com', hostelRoomId: 'room01', major: 'Computer Science' },
    { id: 'student02', userId: 'user02', name: 'Bob Williams', email: 'bob@example.com', hostelRoomId: 'room01', major: 'Electrical Engineering' },
    { id: 'student03', userId: 'user03', name: 'Charlie Brown', email: 'charlie@example.com', hostelRoomId: 'room02', major: 'Mechanical Engineering' },
    { id: 'student04', userId: 'user04', name: 'Diana Miller', email: 'diana@example.com', hostelRoomId: 'room03', major: 'Civil Engineering' },
    { id: 'student05', userId: 'user05', name: 'Ethan Davis', email: 'ethan@example.com', hostelRoomId: 'room03', major: 'Computer Science' },
    { id: 'student06', userId: 'user06', name: 'Fiona Garcia', email: 'fiona@example.com', hostelRoomId: 'room04', major: 'Information Technology' },
];

export const rooms: Room[] = [
    { id: 'room01', roomNumber: 'A-101', capacity: 2, availability: false },
    { id: 'room02', roomNumber: 'A-102', capacity: 2, availability: true },
    { id: 'room03', roomNumber: 'B-205', capacity: 3, availability: false },
    { id: 'room04', roomNumber: 'B-206', capacity: 3, availability: false },
    { id: 'room05', roomNumber: 'C-301', capacity: 2, availability: true },
];

export const initialAnnouncements: Announcement[] = [
    { id: 'ann01', title: 'Hostel Maintenance Schedule', content: 'Please note that there will be scheduled maintenance in B-Wing on Friday from 9 AM to 5 PM.', postDate: formatISO(subDays(new Date(), 1)), adminId: 'admin01' },
    { id: 'ann02', title: 'Annual Sports Fest "Enthusia 2024"', content: 'Get ready for the biggest sports event of the year! Registrations open tomorrow.', postDate: formatISO(subDays(new Date(), 2)), adminId: 'admin01' },
    { id: 'ann03', title: 'Library Extended Hours for Exams', content: 'The central library will be open 24/7 from next week for the upcoming semester exams.', postDate: formatISO(subDays(new Date(), 5)), adminId: 'admin01' },
];

export const initialComplaints: Complaint[] = [
    { id: 'comp01', studentId: 'student01', studentName: 'Alice Johnson', roomNumber: 'A-101', complaintText: 'The Wi-Fi in my room is very slow and disconnects frequently.', submissionDate: formatISO(subDays(new Date(), 3)), status: 'in progress' },
    { id: 'comp02', studentId: 'student03', studentName: 'Charlie Brown', roomNumber: 'A-102', complaintText: 'Water leakage in the bathroom ceiling.', submissionDate: formatISO(subDays(new Date(), 1)), status: 'open' },
    { id: 'comp03', studentId: 'student05', studentName: 'Ethan Davis', roomNumber: 'B-205', complaintText: 'The study lamp in my room is not working.', submissionDate: formatISO(subDays(new Date(), 7)), status: 'resolved' },
    { id: 'comp04', studentId: 'student02', studentName: 'Bob Williams', roomNumber: 'A-101', complaintText: 'Noise disturbance from the adjacent room late at night.', submissionDate: formatISO(subDays(new Date(), 2)), status: 'open' },
    { id: 'comp05', studentId: 'student04', studentName: 'Diana Miller', roomNumber: 'B-205', complaintText: 'A chair in the common area is broken.', submissionDate: formatISO(subDays(new Date(), 4)), status: 'in progress' },
    { id: 'comp06', studentId: 'student06', studentName: 'Fiona Garcia', roomNumber: 'B-206', complaintText: 'I have lost my room key and need a replacement.', submissionDate: formatISO(subDays(new Date(), 1)), status: 'open' },
];

export const fees: Fee[] = [
    { id: 'fee01', studentId: 'student01', studentName: 'Alice Johnson', amount: 50000, dueDate: '2024-08-01', status: 'paid', paymentDate: '2024-07-20' },
    { id: 'fee02', studentId: 'student02', studentName: 'Bob Williams', amount: 50000, dueDate: '2024-08-01', status: 'paid', paymentDate: '2024-07-22' },
    { id: 'fee03', studentId: 'student03', studentName: 'Charlie Brown', amount: 50000, dueDate: '2024-08-01', status: 'unpaid' },
    { id: 'fee04', studentId: 'student04', studentName: 'Diana Miller', amount: 45000, dueDate: '2024-02-01', status: 'overdue' },
    { id: 'fee05', studentId: 'student05', studentName: 'Ethan Davis', amount: 50000, dueDate: '2024-08-01', status: 'paid', paymentDate: '2024-07-15' },
];

export const entryExitLogs: EntryExitLog[] = [
    { id: 'log01', studentId: 'student01', dateTime: formatISO(new Date(new Date().setHours(8, 2, 0))), type: 'entry', recordedBySecurityId: 'sec01' },
    { id: 'log02', studentId: 'student03', dateTime: formatISO(new Date(new Date().setHours(8, 5, 0))), type: 'entry', recordedBySecurityId: 'sec01' },
    { id: 'log03', studentId: 'student04', dateTime: formatISO(new Date(new Date().setHours(8, 10, 0))), type: 'exit', recordedBySecurityId: 'sec01' },
    { id: 'log04', studentId: 'student02', dateTime: formatISO(new Date(new Date().setHours(8, 15, 0))), type: 'entry', recordedBySecurityId: 'sec01' },
    { id: 'log05', studentId: 'student05', dateTime: formatISO(new Date(new Date().setHours(8, 20, 0))), type: 'exit', recordedBySecurityId: 'sec01' },
];

export const dailyEntryExit = [
    { time: '8am', entries: 5, exits: 2 },
    { time: '9am', entries: 12, exits: 4 },
    { time: '10am', entries: 8, exits: 15 },
    { time: '11am', entries: 7, exits: 5 },
    { time: '12pm', entries: 25, exits: 18 },
    { time: '1pm', entries: 15, exits: 22 },
    { time: '2pm', entries: 18, exits: 10 },
    { time: '3pm', entries: 20, exits: 30 },
    { time: '4pm', entries: 35, exits: 25 },
    { time: '5pm', entries: 40, exits: 50 },
];
