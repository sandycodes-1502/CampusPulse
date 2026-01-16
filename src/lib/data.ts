import type { Announcement, Complaint, Feedback } from './types';

export const announcements: Announcement[] = [
  {
    id: '1',
    title: 'Annual Hostel Maintenance',
    content: 'The annual hostel maintenance will be carried out from June 1st to June 10th. Please cooperate with the staff.',
    date: '2024-05-15',
  },
  {
    id: '2',
    title: 'Wi-Fi Upgrade Scheduled',
    content: 'We are upgrading the campus Wi-Fi for better speed and connectivity. Expect intermittent service on May 25th.',
    date: '2024-05-20',
  },
  {
    id: '3',
    title: 'Mess Menu Change for Summer',
    content: 'The mess menu has been updated for the summer season, effective from next week. Check the notice board for details.',
    date: '2024-05-18',
  },
];

export const complaints: Complaint[] = [
  {
    id: 'C1',
    studentName: 'Ravi Kumar',
    roomNumber: 'A-201',
    category: 'Maintenance',
    description: 'The fan in my room is not working properly. It makes a loud noise.',
    status: 'In Progress',
    date: '2024-05-22',
  },
  {
    id: 'C2',
    studentName: 'Priya Sharma',
    roomNumber: 'B-105',
    category: 'Cleaning',
    description: 'The corridor on the first floor of B-block has not been cleaned for two days.',
    status: 'Pending',
    date: '2024-05-23',
  },
  {
    id: 'C3',
    studentName: 'Amit Singh',
    roomNumber: 'C-310',
    category: 'Security',
    description: 'The lock on my room door is faulty.',
    status: 'Resolved',
    date: '2024-05-20',
  },
];

export const initialFeedback: Feedback[] = [
    {
      id: 'F1',
      feedback: 'The Wi-Fi in the library is very slow, making it difficult to study and research.',
      category: 'College',
      date: '2024-05-10',
    },
    {
      id: 'F2',
      feedback: 'The quality of food in the hostel mess has deteriorated over the past month. The rotis are often hard.',
      category: 'Hostel',
      date: '2024-05-12',
    },
    {
      id: 'F3',
      feedback: 'We need more sports facilities. The basketball court is always crowded.',
      category: 'College',
      date: '2024-05-15',
    },
    {
      id: 'F4',
      feedback: 'Hot water is not available in the mornings in C-block. This is very inconvenient, especially during colder days.',
      category: 'Hostel',
      date: '2024-05-18',
    },
];
