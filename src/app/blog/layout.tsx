import { notFound } from 'next/navigation'
import { HIDE_BLOGS } from '@/lib/hideBlogs'

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  if (HIDE_BLOGS) notFound()
  return children
}
