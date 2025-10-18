export default function Loading() {
  return (
    <div className="min-h-screen medical-layout">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8 medical-fade-in">
          {/* Header Skeleton */}
          <div className="text-center mb-12">
            <div className="medical-skeleton-title mx-auto mb-4" />
            <div className="medical-skeleton h-4 w-1/2 mx-auto mb-8" />
            <div className="flex justify-center gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="medical-skeleton-card w-32" />
              ))}
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="medical-skeleton-card mb-8" />
          
          {/* Cards Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="medical-card p-6 space-y-4"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className="medical-skeleton size-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="medical-skeleton h-4 w-3/4" />
                    <div className="medical-skeleton h-3 w-1/2" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="medical-skeleton h-3 w-full" />
                  <div className="medical-skeleton h-3 w-5/6" />
                  <div className="medical-skeleton h-3 w-4/6" />
                </div>
                <div className="flex gap-2 mt-4">
                  <div className="medical-skeleton h-8 w-16 rounded-full" />
                  <div className="medical-skeleton h-8 w-20 rounded-full" />
                </div>
              </div>
            ))}
          </div>

          {/* Table Skeleton */}
          <div className="medical-card p-6 space-y-4">
            <div className="medical-skeleton h-6 w-48 mb-6" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="medical-skeleton size-8 rounded-full" />
                  <div className="flex-1 grid grid-cols-4 gap-4">
                    <div className="medical-skeleton h-4" />
                    <div className="medical-skeleton h-4" />
                    <div className="medical-skeleton h-4" />
                    <div className="medical-skeleton h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Loading Indicator */}
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-current border-t-transparent" />
              <span className="font-medium">Carregando sistema médico...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}