import { redirect } from 'next/navigation'

// Use constant directly to avoid Edge Runtime issues
const defaultLocale = 'ja'

export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
