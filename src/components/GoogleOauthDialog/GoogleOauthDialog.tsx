'use client'

import { useCallback, useEffect, useState } from 'react'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingCircle from '@/components/icons/loading-circle'
import LoadingDots from '@/components/icons/loading-dots'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getGoogleUserInfo } from '@/lib/getGoogleUserInfo'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ClientOnly } from '../ClientOnly'
import { useGoogleOauthDialog } from './useGoogleOauthDialog'

export function GoogleOauthDialog() {
  const { isOpen, setIsOpen } = useGoogleOauthDialog()
  const searchParams = useSearchParams()
  const authType = searchParams?.get('auth_type')

  const login = useCallback(
    async function () {
      const accessToken = searchParams?.get('access_token')!
      try {
        const info = await getGoogleUserInfo(accessToken)
        console.log('=====info:', info)

        const result = await signIn('penx-google', {
          email: info.email,
          openid: info.sub,
          picture: info.picture,
          name: info.name,
          redirect: false,
        })

        if (!result?.ok) {
          toast.error('Failed to sign in with Google. Please try again')
        }
      } catch (error) {
        console.log('>>>>>>>>>>>>erorr:', error)
        toast.error('Failed to sign in with Google. Please try again.')
      }
      location.href = `${location.origin}/${location.pathname}`
    },
    [searchParams],
  )

  useEffect(() => {
    if (authType === 'google' && !isOpen) {
      setIsOpen(true)
      login()
    }
  }, [authType, isOpen, setIsOpen, searchParams, login])

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        closable={false}
        className="h-64 flex items-center justify-center w-[96%] sm:max-w-[425px] rounded-xl focus-visible:outline-none"
      >
        <IconGoogle className="w-6 h-6" />
        <div className="text-lg">Logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
