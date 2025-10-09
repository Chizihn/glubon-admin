// Simple cn utility function since we can't import from @/lib/utils
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
}

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  )
}
