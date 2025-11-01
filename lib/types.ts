// コンテンツブロックの型定義

export interface ContentBlock {
  type: 'heading_h2' | 'paragraph' | 'interactive_chart' | 'comparison_table' | 'pull_quote' | 'definition_box'
  content: any
}

export interface HeadingH2Content {
  text: string
}

export interface ParagraphContent {
  text: string
}

export interface InteractiveChartContent {
  chart_type: 'line' | 'bar' | 'pie'
  title: string
  data: any[]
  x_key: string
  y_key: string
}

export interface ComparisonTableContent {
  headers: string[]
  rows: string[][]
}

export interface PullQuoteContent {
  text: string
  author?: string
}

export interface DefinitionBoxContent {
  term: string
  definition: string
  related_terms?: string[]
}

export interface InsightPost {
  id: string
  slug: string
  title: string
  excerpt: string
  main_image: string
  content_blocks: ContentBlock[]
  categories: string[]
  tags: string[]
  sources?: Array<{ title: string; url: string }>
  created_at: string
  updated_at: string
}

export interface TOCItem {
  id: string
  text: string
  level: number
}
