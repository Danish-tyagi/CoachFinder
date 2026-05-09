export default function SkeletonCard() {
  return (
    <div className="bg-gray-900/60 border border-white/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-800" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-800 rounded-lg w-1/3" />
        <div className="h-6 bg-gray-800 rounded-lg w-3/4" />
        <div className="h-4 bg-gray-800 rounded-lg w-full" />
        <div className="h-4 bg-gray-800 rounded-lg w-2/3" />
        <div className="flex gap-2 pt-2">
          <div className="h-8 bg-gray-800 rounded-lg flex-1" />
          <div className="h-8 bg-gray-800 rounded-lg flex-1" />
        </div>
      </div>
    </div>
  )
}
