'use client'

import { LoadingDots } from '@/components/icons/loading-dots'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { trpc } from '@/lib/trpc'
import { useNavLinkDialog } from './NavLinkDialog/useNavLinkDialog'
import { NavList } from './NavList'
import { ThemeSettingForm } from './ThemeSettingForm'

export function AppearancePage() {
  const { setState } = useNavLinkDialog()
  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Theme settings</CardTitle>
        </CardHeader>
        <CardContent>
          <ThemeSettingForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div>Navigation links</div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setState({
                  isOpen: true,
                  navLink: null as any,
                  index: -1,
                })
              }}
            >
              Add
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <NavList />
        </CardContent>
      </Card>
    </div>
  )
}
