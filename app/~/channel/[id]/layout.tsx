'use client'

import { ReactNode, useMemo } from 'react'
import { ChannelList } from '@/components/DashboardLayout/Sidebar/ChannelList'
import { NavbarWrapper } from '@/components/Navbar/NavbarWrapper'
import { useChannels } from '@/hooks/useChannels'
import { useParams } from 'next/navigation'

export default function Layout({ children }: { children: ReactNode }) {
  const { channels } = useChannels()
  const params = useParams()
  const channelName = useMemo<string>(() => {
    const channel = channels.find((item) => item.id === params.id)
    if (channel) return channel.name
    return ''
  }, [channels, params.id])

  return (
    <div className="h-screen overflow-auto relative">
      <NavbarWrapper className="z-10">
        <div className="font-bold"># {channelName}</div>
      </NavbarWrapper>
      <div className="flex relative z-1">
        <ChannelList />
        <div className="flex flex-col gap-6 w-[860px] mx-auto rounded-2xl mt-4">
          {children}
        </div>
      </div>
    </div>
  )
}
