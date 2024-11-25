import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Bespoke Solutions for Niche Requirements',
  images: [
    {
      url: `${getServerSideURL()}/logo-white-black.png`,
    },
  ],
  siteName: 'EMINENT',
  title: 'EMINENT',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
