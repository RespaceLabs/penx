'use client'

import { arrayMoveImmutable } from 'array-move'
import { produce } from 'immer'
import { ArrowDown, ArrowUp, Edit3, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { DeleteConfirmDialog } from '@/components/DeleteConfirmDialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { defaultNavLinks } from '@/lib/constants'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { useQuerySite } from '@/lib/hooks/useQuerySite'
import { NavLink, NavLinkType, Site } from '@/lib/theme.types'
import { api } from '@/lib/trpc'
import { cn } from '@/lib/utils'
import { NavLinkDialog } from './NavLinkDialog/NavLinkDialog'
import { useNavLinkDialog } from './NavLinkDialog/useNavLinkDialog'

interface Props {}

export function NavList({}: Props) {
  const { site } = useQuerySite()
  const navLinks = (site.navLinks || defaultNavLinks) as NavLink[]
  const { setState } = useNavLinkDialog()
  const { refetch } = useQuerySite()

  return (
    <>
      <NavLinkDialog />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {navLinks.map((item, index) => {
            async function toggleVisible() {
              const newLinks = produce(navLinks, (draft) => {
                draft[index].visible = !draft[index].visible
              })
              // setLinks(newLinks)
              try {
                await api.site.updateSite.mutate({
                  id: site.id,
                  navLinks: newLinks,
                })
                await refetch()
                toast.success('Visible status updated successfully!')
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }

            async function sort(fromIndex: number, toIndex: number) {
              const newLinks = arrayMoveImmutable(navLinks, fromIndex, toIndex)

              // setLinks(newLinks)
              try {
                await api.site.updateSite.mutate({
                  id: site.id,
                  navLinks: newLinks,
                })

                await refetch()
                toast.success('Sorted successfully!')
              } catch (error) {
                toast.error(extractErrorMessage(error))
              }
            }

            return (
              <TableRow key={index}>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.type}</TableCell>
                <TableCell>{item.pathname}</TableCell>
                <TableCell className="flex items-center gap-1 text-foreground/70">
                  <ArrowUp
                    size={18}
                    className={cn(
                      'cursor-pointer',
                      index === 0 && 'disabled cursor-not-allowed opacity-50',
                    )}
                    onClick={() => {
                      if (index === 0) return
                      sort(index, index - 1)
                    }}
                  />
                  <ArrowDown
                    size={18}
                    className={cn(
                      'cursor-pointer',
                      index + 1 === navLinks.length &&
                        'disabled cursor-not-allowed opacity-50',
                    )}
                    onClick={() => {
                      if (index + 1 === navLinks.length) return
                      sort(index, index + 1)
                    }}
                  />

                  {item.visible ? (
                    <Eye
                      size={18}
                      className="cursor-pointer"
                      onClick={toggleVisible}
                    />
                  ) : (
                    <EyeOff
                      size={18}
                      className="cursor-pointer"
                      onClick={toggleVisible}
                    />
                  )}

                  <Edit3
                    size={18}
                    className="cursor-pointer"
                    onClick={() => {
                      setState({
                        isOpen: true,
                        navLink: item,
                        index,
                      })
                    }}
                  />

                  {item.type !== NavLinkType.BUILTIN && (
                    <DeleteConfirmDialog
                      title="Delete navigation"
                      content="Are you sure you want to delete this navigation?"
                      tooltipContent="Delete navigation"
                      onConfirm={async () => {
                        const newLinks = produce(navLinks, (draft) => {
                          draft.splice(index, 1)
                        })
                        await api.site.updateSite.mutate({
                          id: site.id,
                          navLinks: newLinks,
                        })
                        await refetch()
                        toast.success('Navigation deleted successfully!')
                      }}
                    />
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
