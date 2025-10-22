export default function TVDisplayLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="fixed inset-0 m-0 p-0 overflow-hidden">
      {children}
    </div>
  )
}
