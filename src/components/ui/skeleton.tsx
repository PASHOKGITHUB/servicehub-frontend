// import { cn } from "@/lib/utils"

// function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
//   return (
//     <div
//       data-slot="skeleton"
//       className={cn("bg-accent animate-pulse rounded-md", className)}
//       {...props}
//     />
//   )
// }

// export { Skeleton }


import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className }: SkeletonProps) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  );
};

export const CardSkeleton = () => (
  <div className="border border-gray-200 shadow-sm rounded-2xl p-6 space-y-4">
    <div className="flex items-center space-x-4">
      <Skeleton className="w-12 h-12 rounded-full" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <div className="flex justify-between">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-20" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="flex items-center space-x-4 p-4 border border-gray-100 rounded-xl">
    <Skeleton className="w-12 h-12 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-3 w-3/4" />
    </div>
    <Skeleton className="h-8 w-20" />
  </div>
);
