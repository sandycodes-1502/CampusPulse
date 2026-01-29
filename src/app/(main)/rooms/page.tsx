'use client';

import { useMemo, useState, useEffect } from 'react';
import { PageHeader } from '@/components/layout/page-header';
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
import { rooms as initialRooms, students as initialStudents } from '@/lib/data';

interface PopulatedRoom extends HostelRoom {
  students: Student[];
}

export default function RoomsPage() {
  const [populatedRooms, setPopulatedRooms] = useState<PopulatedRoom[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching and processing data
    const timer = setTimeout(() => {
      const studentsByRoomId = new Map<string, Student[]>();
      initialStudents.forEach((student) => {
        if (student.hostelRoomId) {
          if (!studentsByRoomId.has(student.hostelRoomId)) {
            studentsByRoomId.set(student.hostelRoomId, []);
          }
          studentsByRoomId.get(student.hostelRoomId)!.push(student);
        }
      });

      const finalRooms = initialRooms.map((room) => ({
        ...room,
        students: studentsByRoomId.get(room.id) || [],
      }));

      setPopulatedRooms(finalRooms);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

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
