export async function loadTheme() {
  const {
    HomePage,
    AboutPage,
    SiteLayout,
    TagDetailPage,
    TagListPage,
    BlogPage,
    PostDetail,
  } = await import(process.env.NEXT_PUBLIC_THEME!)
  return {
    HomePage,
    AboutPage,
    BlogPage,
    TagListPage,
    SiteLayout,
    TagDetailPage,
    PostDetail,
  }
}
