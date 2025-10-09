import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_BROADCAST_MESSAGE } from '@/graphql/mutations/conversation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Loader2, X, Paperclip } from 'lucide-react';

type Role = 'RENTER' | 'LISTER' | 'ADMIN';

const ROLES: { id: Role; label: string }[] = [
  { id: 'RENTER', label: 'Renters' },
  { id: 'LISTER', label: 'Listers' },
  { id: 'ADMIN', label: 'Admins' },
];

interface BroadcastMessageInputProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  initialValues?: {
    content?: string;
    recipientRoles?: Role[];
    attachments?: string[];
  };
}

export const BroadcastMessageInput: React.FC<BroadcastMessageInputProps> = ({
  onSuccess,
  onCancel,
  initialValues = {},
}) => {
  const [content, setContent] = useState(initialValues.content || '');
  const [recipientRoles, setRecipientRoles] = useState<Role[]>(
    initialValues.recipientRoles || []
  );
  const [attachments, setAttachments] = useState<string[]>(initialValues.attachments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [sendBroadcast] = useMutation(SEND_BROADCAST_MESSAGE, {
    onCompleted: () => {
      setIsSubmitting(false);
      toast.success('Broadcast message sent successfully')
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      console.error('Error sending broadcast:', error);
      setIsSubmitting(false);
      toast.error('Failed to send broadcast message. Please try again.')
    },
  });

  const handleRoleChange = (role: Role) => {
    setRecipientRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // In a real app, you would upload the files to a storage service
    // and get back the URLs to attach to the message
    const newAttachments = Array.from(files).map(
      (file) => `https://example.com/uploads/${file.name}`
    );

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast.error('Please enter a message')
      return;
    }

    if (recipientRoles.length === 0) {
      toast.error('Please select at least one recipient role')
      return;
    }

    setIsSubmitting(true);

    try {
      await sendBroadcast({
        variables: {
          input: {
            content: content.trim(),
            messageType: 'TEXT',
            recipientRoles,
            attachments: attachments.length > 0 ? attachments : undefined,
          },
        },
      });
    } catch (error) {
      console.error('Error sending broadcast:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your broadcast message here..."
          className="min-h-[120px]"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Recipients</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {ROLES.map((role) => (
            <div key={role.id} className="flex items-center space-x-2">
              <Checkbox
                id={role.id}
                checked={recipientRoles.includes(role.id)}
                onCheckedChange={() => handleRoleChange(role.id)}
                disabled={isSubmitting}
              />
              <label
                htmlFor={role.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {role.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            id="attachments"
            className="hidden"
            multiple
            onChange={handleFileChange}
            disabled={isSubmitting}
          />
          <Label
            htmlFor="attachments"
            className="flex items-center px-3 py-2 text-sm border rounded-md cursor-pointer hover:bg-accent"
          >
            <Paperclip className="w-4 h-4 mr-2" />
            Add Files
          </Label>
          <span className="text-sm text-muted-foreground">
            {attachments.length} file(s) attached
          </span>
        </div>
        {attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 text-sm border rounded"
              >
                <span className="truncate">
                  {attachment.split('/').pop()}
                </span>
                <button
                  type="button"
                  onClick={() => removeAttachment(index)}
                  className="text-muted-foreground hover:text-destructive"
                  disabled={isSubmitting}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting || !content.trim() || recipientRoles.length === 0}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            'Send Broadcast'
          )}
        </Button>
      </div>
    </form>
  );
};

export default BroadcastMessageInput;
