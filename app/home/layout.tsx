import { PropsWithChildren } from 'react'
import { Logo } from '@/components/Logo'
import { Profile } from '@/components/Profile/Profile'
import { SpaceFooter } from '@/components/SpaceFooter'
import { Nav } from './Nav'

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col gap-4">
      <div className="z-10  py-3 relative flex justify-between container">
        <div className="flex items-center gap-2 text-xl">
          <Logo className="w-7 h-7" />
          <div className="font-bold" style={{ fontFamily: 'Merienda' }}>
            PenX
          </div>
        </div>

        <Nav />

        <div className="flex items-center gap-10">
          <Profile></Profile>
        </div>
      </div>

      <div className="container relative">
        <div
          className="absolute left-40 top-[400px] z-1 w-[800px] h-[800px] opacity-30"
          style={{
            filter: 'blur(150px) saturate(150%)',
            transform: 'translateZ(0)',
            backgroundImage:
              'radial-gradient(at 27% 37%, #3a8bfd 0, transparent 50%), radial-gradient(at 97% 21%, #9772fe 0, transparent 50%), radial-gradient(at 52% 99%, #fd3a4e 0, transparent 50%), radial-gradient(at 10% 29%, #5afc7d 0, transparent 50%), radial-gradient(at 97% 96%, #e4c795 0, transparent 50%), radial-gradient(at 33% 50%, #8ca8e8 0, transparent 50%), radial-gradient(at 79% 53%, #eea5ba 0, transparent 50%)',
          }}
        ></div>
        <div className="z-10 relative">{children}</div>
      </div>
      <div className="mt-20 relative z-10">
        <SpaceFooter></SpaceFooter>
      </div>
    </div>
  )
}
