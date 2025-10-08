import { useState } from 'react';
import { useQuery,  } from '@apollo/client';
import { format } from 'date-fns';
import { Search, RefreshCw, AlertCircle, Info, AlertTriangle, CheckCircle } from 'lucide-react';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { GET_SYSTEM_LOGS } from '@/graphql/queries/logs';


const LogLevelBadge = ({ level }: { level: string }) => {
  const getBadgeVariant = () => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'destructive' as const;
      case 'warning':
        return 'secondary' as const;
      case 'info':
        return 'default' as const;
      case 'debug':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  const getIcon = () => {
    switch (level.toLowerCase()) {
      case 'error':
        return <AlertCircle className="w-4 h-4 mr-2" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 mr-2 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 mr-2 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 mr-2 text-green-500" />;
      default:
        return <Info className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <Badge variant={getBadgeVariant()} className="flex items-center">
      {getIcon()}
      {level}
    </Badge>
  );
};

const SystemLogsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    level: '',
    startDate: '',
    endDate: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_SYSTEM_LOGS, {
    variables: {
      limit: 50,
      offset: 0,
      ...filters,
    },
    fetchPolicy: 'cache-and-network',
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      level: '',
      startDate: '',
      endDate: '',
    });
  };

  const logs = data?.systemLogs || [];
  const totalCount = data?.systemLogsCount || 0;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">System Logs</h1>
          <p className="text-muted-foreground">View and monitor system-level events and errors</p>
        </div>
        <div className="flex gap-2">
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
            <Button variant="ghost" size="sm" onClick={handleResetFilters}>
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Level</label>
              <Select
                value={filters.level}
                onValueChange={(value) => handleFilterChange('level', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Levels</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">From Date</label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                max={filters.endDate || new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">To Date</label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                min={filters.startDate}
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>
                Showing {logs.length} of {totalCount} logs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Level</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Message</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                    </TableRow>
                  ))
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-destructive">
                      Error loading logs: {error.message}
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
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
                      <TableCell className="font-medium">{log.service || 'N/A'}</TableCell>
                      <TableCell className="max-w-[400px] truncate">{log.message}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemLogsPage;
