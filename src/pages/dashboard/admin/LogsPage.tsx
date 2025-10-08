import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import { format } from 'date-fns';
import { Search, Calendar, Download, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
// ScrollArea component will be implemented later
const ScrollArea = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={className} style={{ overflow: 'auto' }}>{children}</div>
);
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// GraphQL query for logs
const GET_LOGS = gql`
  query GetLogs($limit: Int, $offset: Int, $level: String, $search: String, $startDate: String, $endDate: String) {
    logs(
      limit: $limit
      offset: $offset
      level: $level
      search: $search
      startDate: $startDate
      endDate: $endDate
    ) {
      id
      level
      message
      timestamp
      userId
      action
      metadata
    }
    logsCount(
      level: $level
      search: $search
      startDate: $startDate
      endDate: $endDate
    )
  }
`;

// Log level badge component
const LogLevelBadge = ({ level }: { level: string }) => {
  const getBadgeVariant = () => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'destructive' as const;
      case 'warn':
        return 'secondary' as const;
      case 'info':
        return 'default' as const;
      case 'debug':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  return <Badge variant={getBadgeVariant()}>{level}</Badge>;
};

const LogsPage = () => {
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_LOGS, {
    variables: {
      limit: 50,
      offset: 0,
      search,
      level: level || undefined,
      startDate: dateRange.start || undefined,
      endDate: dateRange.end || undefined,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    refetch();
  };

  const handleReset = () => {
    setSearch('');
    setLevel('');
    setDateRange({ start: '', end: '' });
    refetch({
      search: '',
      level: '',
      startDate: '',
      endDate: '',
    });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    console.log('Export logs');
  };

  const logs = data?.logs || [];
  const totalCount = data?.logsCount || 0;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">View and monitor system activities and events</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Filter Logs</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Search</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search logs..."
                    className="pl-8"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">Level</label>
                <Select value={level} onValueChange={setLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Levels</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="warn">Warning</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="debug">Debug</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">From Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-8"
                    value={dateRange.start}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, start: e.target.value })
                    }
                    max={dateRange.end || format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none">To Date</label>
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="date"
                    className="pl-8"
                    value={dateRange.end}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, end: e.target.value })
                    }
                    min={dateRange.start}
                    max={format(new Date(), 'yyyy-MM-dd')}
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={loading}>
                <Search className="mr-2 h-4 w-4" />
                {loading ? 'Searching...' : 'Search'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Log Entries</CardTitle>
              <CardDescription>
                Showing {logs.length} of {totalCount} logs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-destructive">
                      Error loading logs: {error.message}
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No logs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.timestamp), 'MMM d, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <LogLevelBadge level={log.level} />
                      </TableCell>
                      <TableCell className="font-medium">{log.action}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{log.message}</TableCell>
                      <TableCell>
                        {log.userId ? (
                          <span className="text-sm text-muted-foreground">
                            {log.userId}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">System</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default LogsPage;
