// Fund Detail Page
// - DAF activity
// - Fund detail
// - Contribute to a Fund

import { notFound } from 'next/navigation'

type FundPageProps = {
  params: { id: string }
}

export default async function FundDetail({ params }: FundPageProps) {
  const { id } = await params

  if (!id) { notFound() }

  return (
    <div>
      <h1 className="text-2xl font-bold">Fund Detail {id}</h1>
      <p className="mt-4">Here you can find detailed information about a specific fund.</p>
    </div>
  )
}
