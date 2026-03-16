/* ── Builder Loading Skeleton ─────────────────────────────── */
export default function BuilderLoading() {
  return (
    <div className="h-screen flex flex-col bg-gray-100 animate-pulse">
      {/* Top bar skeleton */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-16 h-4 bg-gray-200 rounded" />
          <div className="w-px h-5 bg-gray-200" />
          <div className="w-24 h-4 bg-gray-200 rounded" />
          <div className="w-32 h-2 bg-gray-200 rounded-full ml-2" />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-8 h-8 bg-gray-200 rounded-lg" />
          <div className="w-24 h-8 bg-blue-200 rounded-lg" />
        </div>
      </div>

      {/* Main area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left panel */}
        <div className="w-[420px] bg-white border-r border-gray-200 hidden md:flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 px-2 py-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex-1 flex justify-center">
                <div className="w-12 h-3 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          {/* Section list */}
          <div className="p-4 space-y-2">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-10 bg-gray-100 rounded-lg" />
            ))}
          </div>
          {/* Editor area */}
          <div className="p-4 space-y-4 flex-1">
            <div className="h-4 w-32 bg-gray-200 rounded" />
            <div className="grid grid-cols-2 gap-3">
              <div className="h-10 bg-gray-100 rounded-lg" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
            <div className="h-10 bg-gray-100 rounded-lg" />
            <div className="h-24 bg-gray-100 rounded-lg" />
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 bg-gray-100 flex items-start justify-center p-8">
          <div className="bg-white rounded-sm shadow-lg w-[595px] max-w-full" style={{ aspectRatio: '8.5/11' }}>
            <div className="p-12 space-y-6">
              <div className="text-center space-y-2">
                <div className="h-6 w-48 bg-gray-200 rounded mx-auto" />
                <div className="h-3 w-32 bg-gray-200 rounded mx-auto" />
                <div className="h-2 w-56 bg-gray-100 rounded mx-auto" />
              </div>
              <div className="border-b border-gray-200" />
              <div className="space-y-3">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-4/5 bg-gray-100 rounded" />
              </div>
              <div className="space-y-3">
                <div className="h-4 w-28 bg-gray-200 rounded" />
                <div className="h-2 w-full bg-gray-100 rounded" />
                <div className="h-2 w-3/4 bg-gray-100 rounded" />
                <div className="h-2 w-5/6 bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
