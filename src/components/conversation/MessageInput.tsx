import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_MESSAGE } from '@/graphql/mutations/conversation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Paperclip, Send } from 'lucide-react';
import { toast } from 'sonner';

interface MessageInputProps {
  conversationId: string;
  onMessageSent?: () => void;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  onMessageSent,
  className = '',
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    onCompleted: () => {
      setMessage('');
      setIsSending(false);
      if (onMessageSent) onMessageSent();
    },
    onError: (error) => {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.')
      setIsSending(false);
    },
    update: (cache, { data }) => {
      if (!data?.sendMessage) return;

      // Update the cache to include the new message
      cache.modify({
        id: `Conversation:${conversationId}`,
        fields: {
          lastMessage: () => data.sendMessage,
          updatedAt: () => new Date().toISOString(),
        },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending) return;

    setIsSending(true);

    try {
      await sendMessage({
        variables: {
          input: {
            conversationId,
            content: message.trim(),
            messageType: 'TEXT',
          },
        },
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`p-4 border-t ${className}`}>
      <div className="flex items-end space-x-2">
        <Button type="button" variant="ghost" size="icon">
          <Paperclip className="h-5 w-5" />
          <span className="sr-only">Attach file</span>
        </Button>
        <div className="flex-1 relative">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[60px] max-h-32 resize-none pr-12"
            rows={1}
          />
        </div>
        <Button type="submit" size="icon" disabled={!message.trim() || isSending}>
          {isSending ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
