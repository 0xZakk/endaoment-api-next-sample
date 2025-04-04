// TODO: Make it so you don't have to be signed in to see this route
'use client'

export default function ErrorPage() {
  return (
    <main className="flex-1 overflow-y-auto px-4 py-16 md:py-4">
      <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <p>Something went wrong. Check the console for errors.</p>
        </div>
      </div>
    </main>
  )
}
