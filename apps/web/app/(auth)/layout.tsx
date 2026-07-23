export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main className="mx-auto flex max-w-md flex-col items-center justify-center px-4 pt-24 pb-20">
      {children}
    </main>
  )
}
