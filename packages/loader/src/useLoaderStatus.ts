import { mutate, useStore } from 'stook'

const key = 'LoaderStatus'

export const useLoaderStatus = () => {
  const [isLoaded] = useStore(key, false)

  return {
    isLoaded,
  }
}

export function mutateLoaderStatus(isLoaded: boolean) {
  mutate(key, isLoaded)
}
