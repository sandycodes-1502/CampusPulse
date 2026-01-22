import { PageHeader } from '@/components/layout/page-header';
import { Room, rooms } from '@/lib/rooms';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function RoomsPage() {
  return (
    <>
      <PageHeader title="Hostel Rooms" />
      <div className="container mx-auto py-10">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Number</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead>Student ID</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rooms.map((room: Room) => (
                <TableRow key={room.roomNumber}>
                  <TableCell>{room.roomNumber}</TableCell>
                  <TableCell>{room.studentName || 'N/A'}</TableCell>
                  <TableCell>{room.studentId || 'N/A'}</TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`
                        ${room.status === 'Occupied' && 'bg-red-500'}
                        ${room.status === 'Vacant' && 'bg-green-500'}
                      `}
                    >
                      {room.status}
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
