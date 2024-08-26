import LoadingDots from '@/components/icons/loading-dots'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useSpace } from '@/hooks/useSpace'
import { useThemes } from '@/hooks/useThemes'
import { trpc } from '@/lib/trpc'
import { usePublishThemeDialog } from './usePublishThemeDialog'

export function PublishThemeDialog() {
  const { isOpen, theme, setIsOpen } = usePublishThemeDialog()
  const { space } = useSpace()
  const { refetch } = useThemes()
  const { isPending, mutateAsync } = trpc.theme.publish.useMutation()
  return (
    <AlertDialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Publish theme</AlertDialogTitle>
          <AlertDialogDescription>Publish this theme?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button
            disabled={isPending}
            onClick={async () => {
              await mutateAsync({ id: theme.id, spaceId: space.id })
              refetch()
              setIsOpen(false)
            }}
          >
            {isPending ? <LoadingDots color="white" /> : 'Publish'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
