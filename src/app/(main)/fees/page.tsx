import { PageHeader } from '@/components/layout/page-header';
import { Fee, fees } from '@/lib/fees';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export default function FeesPage() {
  return (
    <>
      <PageHeader title="Fee Management" />
      <div className="container mx-auto py-10">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Student Name</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead className="text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fees.map((fee: Fee) => (
                <TableRow key={fee.studentId}>
                  <TableCell>{fee.studentId}</TableCell>
                  <TableCell>{fee.studentName}</TableCell>
                  <TableCell className="text-right">
                    ${fee.amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      className={`
                        ${fee.status === 'Paid' && 'bg-green-500'}
                        ${fee.status === 'Unpaid' && 'bg-yellow-500'}
                        ${fee.status === 'Overdue' && 'bg-red-500'}
                      `}
                    >
                      {fee.status}
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
