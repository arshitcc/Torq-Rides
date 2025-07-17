import { Loader2Icon } from "lucide-react";

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#121212]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2Icon className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      </div>
    </div>
  );
}

export default Loading;
