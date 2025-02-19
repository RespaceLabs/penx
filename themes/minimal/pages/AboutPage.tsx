import { ContentRender } from '@/components/theme-ui/ContentRender'
import { PageTitle } from '@/components/theme-ui/PageTitle'
import { Site } from '@/lib/theme.types'

interface Props {
  site: Site
}

export function AboutPage({ site }: Props) {
  return (
    <>
      <div className="">
        <PageTitle>About</PageTitle>
        <div className="">
          <div className="flex flex-col items-center space-x-2 pt-8">
            {site.logo && (
              <img
                src={site.logo}
                alt="avatar"
                className="h-48 w-48 rounded-full"
              />
            )}
            <h3 className="pb-2 pt-4 text-2xl font-bold leading-8 tracking-tight">
              {site.name}
            </h3>
            <div className="text-foreground/60">{site.description}</div>
          </div>
          <div className="prose max-w-none pb-8 pt-8 dark:prose-invert xl:col-span-2 mx-auto lg:max-w-3xl">
            <ContentRender content={site.about} />
          </div>
        </div>
      </div>
    </>
  )
}
