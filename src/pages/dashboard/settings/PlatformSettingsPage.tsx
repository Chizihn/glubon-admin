import { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Loader2, Pencil, Save, X } from 'lucide-react';
import { usePlatformSettings } from '../../../hooks/usePlatformSettings';
import { useAuthStore } from '@/store/authStore';
import { RoleEnum } from '@/types/enums';

export default function PlatformSettingsPage() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [editDescription, setEditDescription] = useState('');
  
  const isAdmin = user?.role === RoleEnum.ADMIN
  
  const {
    settings,
    loading,
    updateSetting,
    isUpdating,
    refetch,
  } = usePlatformSettings(1, 20, { search: searchTerm });

  const handleEdit = (setting: any) => {
    setEditingKey(setting.key);
    setEditValue(setting.value);
    setEditDescription(setting.description || '');
  };

  const handleSave = async (key: string) => {
    try {
      await updateSetting({
        key,
        value: editValue,
        description: editDescription,
      });
      setEditingKey(null);
      refetch();
    } catch (error) {
      console.error('Error updating setting:', error);
    }
  };

  const handleCancel = () => {
    setEditingKey(null);
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p>You don't have permission to access this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <div className="mt-4 md:mt-0">
          <Input
            placeholder="Search settings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Key</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.map((setting: any) => (
                  <TableRow key={setting.key}>
                    <TableCell className="font-medium">{setting.key}</TableCell>
                    <TableCell>
                      {editingKey === setting.key ? (
                        <Input
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full"
                        />
                      ) : (
                        <div className="truncate max-w-xs">{setting.value}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingKey === setting.key ? (
                        <Input
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full"
                          placeholder="Description (optional)"
                        />
                      ) : (
                        setting.description || '—'
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(setting.updatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {setting.updater?.email || 'System'}
                    </TableCell>
                    <TableCell>
                      {editingKey === setting.key ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleSave(setting.key)}
                            disabled={isUpdating}
                          >
                            {isUpdating ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleCancel}
                            disabled={isUpdating}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(setting)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
