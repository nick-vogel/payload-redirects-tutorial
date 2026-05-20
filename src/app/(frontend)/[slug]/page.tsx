import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { getPayload } from 'payload'

import config from '@/payload.config'

type Props = { params: Promise<{ slug: string }> }

export default async function Page({
  params,
}: Props) {
  const { slug } = await params
  const payload = await getPayload({
    config: await config,
  })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = docs[0]
  if (!page) {
    // No page at this slug — check for a configured redirect before 404ing.
    const { docs: redirects } = await payload.find({
      collection: 'redirects',
      depth: 1, // populate the `to.reference` relationship
      limit: 1,
      where: {
        or: [{ from: { equals: slug } }, { from: { equals: `/${slug}` } }],
      },
    })

    const match = redirects[0]
    if (match) {
      const reference = match.to?.reference
      let destination: string | undefined = match.to?.url ?? undefined

      if (reference && typeof reference.value === 'object') {
        destination = `/${reference.value.slug}`
      }

      if (destination) {
        // '301' (Permanent) → permanentRedirect (HTTP 308)
        // '302' (Temporary) → redirect (HTTP 307)
        if (match.type === '301') permanentRedirect(destination)
        redirect(destination)
      }
    }

    notFound()
  }

  return (
    <article
      style={{
        padding: '2rem',
        maxWidth: 720,
        margin: '0 auto',
      }}
    >
      <h1>{page.title}</h1>
      {page.body && (
        <p style={{ whiteSpace: 'pre-wrap' }}>
          {page.body}
        </p>
      )}
    </article>
  )
}
