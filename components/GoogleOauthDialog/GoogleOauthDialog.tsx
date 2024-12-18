'use client'

import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { IconGoogle } from '@/components/icons/IconGoogle'
import LoadingCircle from '@/components/icons/loading-circle'
import { LoadingDots } from '@/components/icons/loading-dots'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getGoogleUserInfo } from '@/lib/getGoogleUserInfo'
import useSession from '@/lib/useSession'
import { ClientOnly } from '../ClientOnly'
import { useGoogleOauthDialog } from './useGoogleOauthDialog'

export function GoogleOauthDialog() {
  const { isOpen, setIsOpen } = useGoogleOauthDialog()
  const searchParams = useSearchParams()
  const authType = searchParams?.get('auth_type')
  const { login } = useSession()

  const loginWithGoogle = useCallback(
    async function () {
      const accessToken = searchParams?.get('access_token')!
      try {
        const info = await getGoogleUserInfo(accessToken)
        console.log('=====info:', info)

        const result: any = await login({
          type: 'penx-google',
          email: info.email,
          openid: info.sub,
          picture: info.picture,
          name: info.name,
        })
      } catch (error) {
        console.log('>>>>>>>>>>>>erorr:', error)
        toast.error('Failed to sign in with Google. Please try again.')
      }
      location.href = `${location.origin}/${location.pathname}`
    },
    [searchParams, login],
  )

  useEffect(() => {
    if (authType === 'google' && !isOpen) {
      setIsOpen(true)
      loginWithGoogle()
    }
  }, [authType, isOpen, setIsOpen, searchParams, loginWithGoogle])

  return (
    <Dialog open={isOpen} onOpenChange={(v) => setIsOpen(v)}>
      <DialogContent
        closable={false}
        className="h-64 flex items-center justify-center w-[96%] sm:max-w-[425px] rounded-xl focus-visible:outline-none"
      >
        <DialogTitle className="hidden"></DialogTitle>
        <IconGoogle className="w-6 h-6" />
        <div className="text-lg">Logging in</div>
        <LoadingDots className="bg-foreground/60" />
      </DialogContent>
    </Dialog>
  )
}
