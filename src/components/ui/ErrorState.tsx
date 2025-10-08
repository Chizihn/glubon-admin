// components/ErrorState.tsx

import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Retry",
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 text-center">
      <AlertCircle className="h-12 w-12 text-red-500" />
      <h3 className="text-lg font-medium">{title}</h3>
      <p className="text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
