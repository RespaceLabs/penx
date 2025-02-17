import { ReactNode } from 'react'
import { ContentRender } from '@/components/theme-ui/ContentRender'

interface LayoutProps {
  page: any
  content: any
  children: ReactNode
  className?: string
}

export function PageDetail({ content, className }: LayoutProps) {
  return (
    <article className="mt-10 sm:mt-20 mx-auto w-full lg:max-w-3xl">
      <div className="prose max-w-none pb-8 dark:prose-invert">
        <ContentRender content={content} />
      </div>
    </article>
  )
}
