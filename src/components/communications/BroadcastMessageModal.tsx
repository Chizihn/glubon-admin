import { useState } from "react";
import { useMutation } from "@apollo/client";
import { BROADCAST_MESSAGE } from "@/graphql/communications";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2,  } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

type BroadcastMessageModalProps = {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
};

export function BroadcastMessageModal({ isOpen, onClose, users }: BroadcastMessageModalProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [broadcastMessage, { loading }] = useMutation(BROADCAST_MESSAGE, {
    onCompleted: () => {
      toast.success(`Broadcast message sent to ${selectedUserIds.length} recipients`);
      handleClose();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleClose = () => {
    setSubject("");
    setMessage("");
    setSelectedUserIds([]);
    setSearchQuery("");
    onClose();
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim() || selectedUserIds.length === 0) {
      toast.error("Please fill in all fields and select at least one recipient.");
      return;
    }

    try {
      await broadcastMessage({
        variables: {
          input: {
            subject,
            content: message,
            messageType: "TEXT",
            recipientIds: selectedUserIds,
          },
        },
      });
    } catch (error) {
      console.error("Error sending broadcast:", error);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Send Broadcast Message</DialogTitle>
          <DialogDescription>
            Send a message to multiple users at once.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
          <div className="space-y-4 overflow-y-auto flex-1">
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message here..."
                rows={6}
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Recipients ({selectedUserIds.length} selected)</Label>
                <div className="relative w-64">
                  <Input
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-8"
                  />
                </div>
              </div>

              <div className="border rounded-md h-48 overflow-y-auto p-2 space-y-2">
                {filteredUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    {searchQuery ? "No matching users found" : "No users available"}
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className={`flex items-center p-2 rounded-md cursor-pointer ${
                        selectedUserIds.includes(user.id) ? "bg-accent" : "hover:bg-muted"
                      }`}
                      onClick={() => toggleUserSelection(user.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedUserIds.includes(user.id)}
                        onChange={() => {}}
                        className="mr-2 h-4 w-4"
                      />
                      <div className="flex-1">
                        <div className="font-medium">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading || selectedUserIds.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                `Send to ${selectedUserIds.length} user${selectedUserIds.length !== 1 ? 's' : ''}`
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default BroadcastMessageModal;
