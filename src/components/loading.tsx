export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 rounded-2xl w-1/3 mx-auto mb-4" />
            <div className="h-16 bg-gray-200 rounded-2xl w-2/3 mx-auto mb-8" />
            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-2xl w-32" />
              ))}
            </div>
          </div>
          
          <div className="h-32 bg-gray-200 rounded-2xl mb-8" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}