'use client'

import { useState, useEffect, useRef } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ReportCard from '@/components/ReportCard'
import { Locale } from '@/lib/i18n/config'
import { getTableName } from '@/lib/i18n/config'
import { supabase } from '@/lib/supabase'

const POSTS_PER_PAGE = 16

interface HomeClientProps {
  locale: Locale
  dictionary: any
  initialReports: any[]
}

export default function HomeClient({ locale, dictionary, initialReports }: HomeClientProps) {
  const [allReports, setAllReports] = useState(initialReports)
  const [displayedReports, setDisplayedReports] = useState(initialReports.slice(0, POSTS_PER_PAGE))
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(dictionary.home.categories.all)
  const observerTarget = useRef<HTMLDivElement>(null)

  const categories = [
    dictionary.home.categories.all,
    dictionary.home.categories.announcement,
    dictionary.home.categories.residence,
    dictionary.home.categories.career,
    dictionary.home.categories.finance,
    dictionary.home.categories.tax,
    dictionary.home.categories.culture,
    dictionary.home.categories.data,
    dictionary.home.categories.travel,
    dictionary.home.categories.food,
  ]

  // Re-fetch when locale changes (client-side navigation)
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true)
      try {
        const tableName = getTableName(locale)
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .order('created_at', { ascending: false })

        if (!error && data) {
          setAllReports(data)
          setDisplayedReports(data.slice(0, POSTS_PER_PAGE))
        }
      } catch (error) {
        console.error('Error fetching reports:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchReports()
  }, [locale])

  useEffect(() => {
    filterReports()
  }, [searchQuery, selectedCategory, allReports, dictionary])

  const filterReports = () => {
    let filtered = [...allReports]

    // Category filter
    if (selectedCategory !== dictionary.home.categories.all) {
      filtered = filtered.filter((report) =>
        report.categories && report.categories.includes(selectedCategory)
      )
    }

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(query) ||
          report.excerpt.toLowerCase().includes(query) ||
          (report.tags && report.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      )
    }

    setDisplayedReports(filtered.slice(0, POSTS_PER_PAGE))
  }

  const loadMore = () => {
    if (loading) return

    setLoading(true)
    let filtered = [...allReports]

    if (selectedCategory !== dictionary.home.categories.all) {
      filtered = filtered.filter((report) =>
        report.categories && report.categories.includes(selectedCategory)
      )
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(query) ||
          report.excerpt.toLowerCase().includes(query) ||
          (report.tags && report.tags.some((tag: string) => tag.toLowerCase().includes(query)))
      )
    }

    const currentCount = displayedReports.length
    const nextReports = filtered.slice(currentCount, currentCount + POSTS_PER_PAGE)

    if (nextReports.length > 0) {
      setDisplayedReports([...displayedReports, ...nextReports])
    }
    setLoading(false)
  }

  useEffect(() => {
    if (!observerTarget.current || loading) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMore()
        }
      },
      { threshold: 0.1 }
    )

    const currentTarget = observerTarget.current
    observer.observe(currentTarget)

    return () => {
      observer.unobserve(currentTarget)
    }
  }, [displayedReports.length, loading])

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {dictionary.home.title}
          </h1>
          <p className="text-xl text-gray-600">{dictionary.home.subtitle}</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder={dictionary.home.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <svg
              className="absolute left-4 top-3.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Results count */}
          {(searchQuery || selectedCategory !== dictionary.home.categories.all) && (
            <div className="text-sm text-gray-600">
              {displayedReports.length}
              {dictionary.home.searchResults}
            </div>
          )}
        </div>

        {/* Blog Posts Grid */}
        {loading && displayedReports.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">{dictionary.home.loading}</p>
          </div>
        ) : displayedReports.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {displayedReports.map((report: any) => (
                <ReportCard
                  key={report.id}
                  id={report.id}
                  slug={report.slug}
                  title={report.title}
                  excerpt={report.excerpt}
                  main_image={report.main_image}
                  categories={report.categories || []}
                  created_at={report.created_at}
                  locale={locale}
                />
              ))}
            </div>

            {/* Infinite scroll trigger */}
            <div ref={observerTarget} className="mt-8 text-center py-8">
              {loading && (
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-6">🔍</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {dictionary.home.noResults.title}
            </h2>
            <p className="text-gray-600">{dictionary.home.noResults.description}</p>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

