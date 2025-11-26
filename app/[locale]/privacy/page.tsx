import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getDictionary } from '@/lib/i18n/dictionaries'
import { isValidLocale } from '@/lib/i18n/config'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface PageProps {
    params: { locale: string }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const locale = params?.locale || 'ja'

    if (!isValidLocale(locale)) {
        return {}
    }

    const dictionary = await getDictionary(locale)
    const baseUrl = 'https://shiftjapaninsight.com'
    const url = `${baseUrl}/${locale}/privacy`

    return {
        title: `${dictionary.privacy.title} | Shift Japan Insight`,
        description: dictionary.privacy.intro,
        alternates: {
            canonical: url,
            languages: {
                'ja': `${baseUrl}/ja/privacy`,
                'en': `${baseUrl}/en/privacy`,
                'ko': `${baseUrl}/ko/privacy`,
            },
        },
    }
}

export default async function PrivacyPage({ params }: PageProps) {
    const locale = params?.locale || 'ja'

    if (!isValidLocale(locale)) {
        notFound()
    }

    const dictionary = await getDictionary(locale)

    return (
        <>
            <Header />
            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <article className="bg-white rounded-lg shadow-md border border-gray-200 p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 pb-4 border-b border-gray-200">
                        {dictionary.privacy.title}
                    </h1>

                    <div className="prose max-w-none text-gray-700 space-y-8">
                        <section>
                            <p className="leading-relaxed">{dictionary.privacy.intro}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.privacy.adsense.title}</h2>
                            <p className="leading-relaxed">{dictionary.privacy.adsense.content}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.privacy.analytics.title}</h2>
                            <p className="leading-relaxed">{dictionary.privacy.analytics.content}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.privacy.cookies.title}</h2>
                            <p className="leading-relaxed">{dictionary.privacy.cookies.content}</p>
                        </section>

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">{dictionary.privacy.disclaimer.title}</h2>
                            <p className="leading-relaxed">{dictionary.privacy.disclaimer.content}</p>
                        </section>
                    </div>
                </article>
            </main>
            <Footer />
        </>
    )
}

export async function generateStaticParams() {
    return [{ locale: 'ja' }, { locale: 'en' }, { locale: 'ko' }]
}
