import { notFound } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

type Props = { params: Promise<{ slug: string }> }

export default async function Page({ params }: Props) {
  const { slug } = await params
  const payload = await getPayload({ config: await config })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = docs[0]
  if (!page) notFound()

  return (
    <article style={{ padding: '2rem', maxWidth: 720, margin: '0 auto' }}>
      <h1>{page.title}</h1>
      {page.body && <p style={{ whiteSpace: 'pre-wrap' }}>{page.body}</p>}
    </article>
  )
}
