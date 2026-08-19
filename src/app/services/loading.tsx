function SkeletonBlock({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-xl bg-slate-200/70 ${className}`} />
}

export default function Loading() {
  return (
    <main className="bg-slate-50 min-h-screen">
      <section className="relative overflow-hidden bg-[#0b293d]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 py-16 md:py-24">
          <SkeletonBlock className="h-4 w-32 mb-5 bg-white/20" />
          <SkeletonBlock className="h-12 w-full max-w-3xl mb-4 bg-white/20" />
          <SkeletonBlock className="h-6 w-full max-w-2xl mb-2 bg-white/15" />
          <SkeletonBlock className="h-6 w-3/4 max-w-xl bg-white/15" />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <SkeletonBlock className="h-40 w-full mb-5 rounded-2xl" />
              <SkeletonBlock className="h-6 w-3/4 mb-3" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-5/6 mb-6" />
              <SkeletonBlock className="h-4 w-24" />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
