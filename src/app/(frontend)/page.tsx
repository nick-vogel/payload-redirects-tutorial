import SlugPage from './[slug]/page'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  return SlugPage({ params: Promise.resolve({ slug: 'home' }) })
}
