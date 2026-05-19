import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField({
      name: 'slug',
      useAsSlug: 'title',
      required: true,
    }),
    { name: 'body', type: 'textarea' },
  ],
}
