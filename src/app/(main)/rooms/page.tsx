'use client';

import { useMemo } from 'react';
import { collection, collectionGroup, query, orderBy, limit } from 'firebase/firestore';

import { PageHeader } from '@/components/layout/page-header';
import {
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import type { Room as HostelRoom, Student } from '@/lib/types';

interface PopulatedRoom extends HostelRoom {
  students: Student[];
}

export default function RoomsPage() {
  const firestore = useFirestore();

  const roomsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'hostel_rooms'), orderBy('roomNumber'));
  }, [firestore]);

  const studentsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // This is a collection group query to get all students from all users.
    // Firestore security rules must allow this for the admin role.
    return query(collectionGroup(firestore, 'students'), orderBy('name'), limit(100));
  }, [firestore]);

  const { data: rooms, isLoading: isLoadingRooms } =
    useCollection<HostelRoom>(roomsQuery);
  const { data: students, isLoading: isLoadingStudents } =
    useCollection<Student>(studentsQuery);

  const populatedRooms: PopulatedRoom[] | null = useMemo(() => {
    if (!rooms || !students) return null;

    const studentsByRoomId = new Map<string, Student[]>();
    students.forEach((student) => {
      if (student.hostelRoomId) {
        if (!studentsByRoomId.has(student.hostelRoomId)) {
          studentsByRoomId.set(student.hostelRoomId, []);
        }
        studentsByRoomId.get(student.hostelRoomId)!.push(student);
      }
    });

    return rooms.map((room) => ({
      ...room,
      students: studentsByRoomId.get(room.id) || [],
    }));
  }, [rooms, students]);

  const isLoading = isLoadingRooms || isLoadingStudents;

  return (
    <>
      <PageHeader title="Hostel Rooms" />
      <div className="container mx-auto py-10">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Occupants</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array.from({ length: 10 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton className="h-4 w-24" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-48" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="h-4 w-16" />
                      </TableCell>
                      <TableCell className="text-center">
                        <Skeleton className="h-6 w-20 mx-auto" />
                      </TableCell>
                    </TableRow>
                  ))
                : populatedRooms?.length === 0
                ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      No rooms found.
                    </TableCell>
                  </TableRow>
                )
                : populatedRooms?.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell>{room.roomNumber}</TableCell>
                      <TableCell>
                        {room.students.length > 0
                          ? room.students.map((s) => s.name).join(', ')
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {room.students.length} / {room.capacity}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge
                          className={
                            room.availability
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }
                        >
                          {room.availability ? 'Available' : 'Occupied'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
