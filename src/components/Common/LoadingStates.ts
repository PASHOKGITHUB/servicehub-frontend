export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface MutationState {
  isPending: boolean;
  isError: boolean;
  error: Error | null;
}