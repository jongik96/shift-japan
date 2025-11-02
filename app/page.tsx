import { redirect } from 'next/navigation'

// Define directly to avoid any Edge Runtime issues
const defaultLocale = 'ja'

export default function RootPage() {
  redirect(`/${defaultLocale}`)
}
