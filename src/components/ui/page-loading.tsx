import { LoadingSpinner } from './loading-spinner';

interface PageLoadingProps {
  title?: string;
  subtitle?: string;
}

export const PageLoading = ({ 
  title = 'Loading...', 
  subtitle = 'Please wait while we fetch your data' 
}: PageLoadingProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8">
        <LoadingSpinner size="lg" className="mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-semibold mb-2 text-gray-800">{title}</h2>
        <p className="text-gray-600 mb-4">{subtitle}</p>
        <div className="bg-gray-100 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-sm text-gray-500">
            This should only take a moment. If you continue to see this screen, 
            please refresh the page or clear your browser cache.
          </p>
        </div>
      </div>
    </div>
  );
};
