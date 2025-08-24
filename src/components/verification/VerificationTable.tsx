import { useState } from 'react';
import { Check, X, Eye, Loader2 } from 'lucide-react';
import { Verification } from '@/types/verification';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface VerificationTableProps {
  verifications: Verification[];
  loading: boolean;
  onView: (verification: Verification) => void;
  onApprove: (verification: Verification) => void;
  onReject: (verification: Verification) => void;
  isReviewing: boolean;
}

export function VerificationTable({
  verifications,
  loading,
  onView,
  onApprove,
  onReject,
  isReviewing,
}: VerificationTableProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'REJECTED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (verifications.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No verification requests found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <div className="relative w-full overflow-auto">
        <table className="w-full caption-bottom text-sm">
          <thead className="[&_tr]:border-b">
            <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                User
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Document Type
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Document Number
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Status
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Submitted On
              </th>
              <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {verifications.map((verification) => (
              <tr
                key={verification.id}
                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
              >
                <td className="p-4 align-middle">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {verification.user.firstName} {verification.user.lastName}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {verification.user.email}
                    </span>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <span className="capitalize">
                    {verification.documentType.toLowerCase().replace('_', ' ')}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <span className="font-mono text-sm">
                    {verification.documentNumber}
                  </span>
                </td>
                <td className="p-4 align-middle">
                  <Badge variant={getStatusBadgeVariant(verification.status)}>
                    {verification.status}
                  </Badge>
                </td>
                <td className="p-4 align-middle">
                  <span className="text-sm text-muted-foreground">
                    {formatDate(verification.createdAt)}
                  </span>
                </td>
                <td className="p-4 align-middle text-right">
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onView(verification)}
                      title="View Documents"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-green-600 hover:bg-green-50 hover:text-green-700"
                      onClick={() => onApprove(verification)}
                      disabled={isReviewing}
                      title="Approve"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => onReject(verification)}
                      disabled={isReviewing}
                      title="Reject"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
