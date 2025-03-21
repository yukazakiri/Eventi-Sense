export const Skeleton = ({ rows, columns }: { rows: number; columns: number }) => (
    <div className="animate-pulse space-y-4 p-6">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4">
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="h-4 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
          ))}
        </div>
      ))}
    </div>
  );

  export const ErrorMessage = ({ message, onRetry }: { message: string; onRetry: () => void }) => (
    <div className="p-4 mb-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center justify-between">
      <span className="text-red-700 dark:text-red-300">{message}</span>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300"
      >
        Retry
      </button>
    </div>
  );