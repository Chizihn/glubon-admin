import  { useState } from 'react';
import { useQuery } from '@apollo/client';
import { format } from 'date-fns';
import { Search, RefreshCw,  } from 'lucide-react';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GET_ADMIN_LOGS } from '@/graphql/queries/logs';


const ActionBadge = ({ action }: { action: string }) => {
  const getBadgeVariant = () => {
    switch (action.toLowerCase()) {
      case 'create':
        return 'default' as const;
      case 'update':
        return 'secondary' as const;
      case 'delete':
        return 'destructive' as const;
      case 'login':
        return 'outline' as const;
      default:
        return 'default' as const;
    }
  };

  return (
    <Badge variant={getBadgeVariant()}>
      {action}
    </Badge>
  );
};

const AdminActivityLogsPage = () => {
  const [filters, setFilters] = useState({
    search: '',
    action: '',
    startDate: '',
    endDate: '',
  });

  const { loading, error, data, refetch } = useQuery(GET_ADMIN_LOGS, {
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
      action: '',
      startDate: '',
      endDate: '',
    });
  };

  const logs = data?.adminLogs || [];
  const totalCount = data?.adminLogsCount || 0;

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Activity Logs</h1>
          <p className="text-muted-foreground">Track and monitor administrator activities and changes</p>
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
                  placeholder="Search activities..."
                  className="pl-8"
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium leading-none">Action</label>
              <Select
                value={filters.action}
                onValueChange={(value) => handleFilterChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Actions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="settings_update">Settings Update</SelectItem>
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
              <CardTitle>Admin Activities</CardTitle>
              <CardDescription>
                Showing {logs.length} of {totalCount} activities
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Admin</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={`skeleton-${i}`}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-64" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
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
                      No activity logs found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell className="whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={log.user?.profilePic} />
                            <AvatarFallback>
                              {log.user?.firstName?.[0]}{log.user?.lastName?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">
                              {log.user?.firstName} {log.user?.lastName}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {log.user?.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <ActionBadge action={log.action} />
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">
                        {log.details || 'No details available'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {log.ipAddress || 'N/A'}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(log.createdAt), 'MMM d, yyyy HH:mm')}
                      </TableCell>
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

export default AdminActivityLogsPage;
