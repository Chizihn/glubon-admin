import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";
import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";



interface Column<T> {
  key: string;
  header: string;
  cell: (row: T) => React.ReactNode;
}

interface CustomDataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function CustomDataTable<T>({
  columns,
  data,
  loading = false,
  pageCount = 1,
  pageIndex = 0,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange,
}: CustomDataTableProps<T>) {
  if (loading && data.length === 0) {
    return (
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }
  
  // Ensure we have valid page values
  const safePageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));
  const safePageSize = Math.max(1, pageSize);
  const startItem = safePageIndex * safePageSize + 1;
  const endItem = Math.min((safePageIndex + 1) * safePageSize, totalItems);

  return (
    <div className="rounded-md border">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columns.map((column) => (
                    <TableCell key={`${rowIndex}-${column.key}`}>
                      {column.cell(row as any)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t">
        <div className="text-sm text-muted-foreground">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span>{' '}
          of <span className="font-medium">{totalItems}</span> results
        </div>
        <div className="flex items-center space-x-2">
          <select
            className={cn(
              "h-8 rounded-md border border-input bg-background px-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            )}
            value={pageSize}
            onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
          <div className="flex space-x-1">
            <button
              type="button"
              className={cn(
                "h-8 w-8 rounded border p-1 flex items-center justify-center",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
              onClick={() => onPageChange?.(pageIndex - 1)}
              disabled={pageIndex === 0}
              aria-label="Previous page"
            >
              ←
            </button>
            <button
              type="button"
              className={cn(
                "h-8 w-8 rounded border p-1 flex items-center justify-center",
                "hover:bg-accent hover:text-accent-foreground",
                "disabled:opacity-50 disabled:pointer-events-none"
              )}
              onClick={() => onPageChange?.(pageIndex + 1)}
              disabled={pageIndex >= pageCount - 1}
              aria-label="Next page"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
