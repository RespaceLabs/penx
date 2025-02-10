import { ContentRender } from './ContentRender/ContentRender'

interface Props {
  content: any
}

export function PageDefaultUI({ content }: Props) {
  return (
    <div className="mt-10 sm:mt-20 mx-auto w-full lg:max-w-3xl">
      <div className="prose max-w-none pb-8 dark:prose-invert w-full">
        <ContentRender content={content} />
      </div>
    </div>
  )
}
