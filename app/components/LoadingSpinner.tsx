export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
    </div>
  );
} 