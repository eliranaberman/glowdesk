
import { TableRow, TableCell } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';

interface TableLoadingSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

const TableLoadingSkeleton = ({ rowCount = 5 }: TableLoadingSkeletonProps) => {
  return (
    <>
      {Array(rowCount).fill(0).map((_, i) => (
        <TableRow key={`skeleton-${i}`}>
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-[180px]" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-[80px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-[80px]" /></TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default TableLoadingSkeleton;
