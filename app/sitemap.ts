import { MetadataRoute } from 'next'

// Edge Runtime 안전: config에서 import하지 않고 직접 정의
const locales = ['ja', 'en', 'ko']

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://shiftjapaninsight.com'

  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Add localized routes
  for (const locale of locales) {
    if (locale !== 'ja') {
      // ja is default, already included above
      routes.push(
        {
          url: `${baseUrl}/${locale}`,
          lastModified: new Date(),
          changeFrequency: 'daily' as const,
          priority: 1.0,
        },
        {
          url: `${baseUrl}/${locale}/about`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.8,
        },
        {
          url: `${baseUrl}/${locale}/contact`,
          lastModified: new Date(),
          changeFrequency: 'monthly' as const,
          priority: 0.7,
        }
      )
    }
  }

  return routes
}

