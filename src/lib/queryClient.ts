import { QueryClient } from '@tanstack/react-query';

interface ErrorWithResponse {
  response?: {
    status?: number;
  };
}

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: false, // Prevent automatic refetch on mount
      retry: (failureCount, error: Error) => {
        const errorWithResponse = error as ErrorWithResponse;
        // Don't retry on 401, 403, 404 errors
        if (errorWithResponse?.response?.status === 401 || 
            errorWithResponse?.response?.status === 403 || 
            errorWithResponse?.response?.status === 404) {
          return false;
        }
        return failureCount < 2; // Reduced retry attempts
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
