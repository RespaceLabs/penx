'use client'

import { useSpace } from "@/hooks/useSpace"
import { About } from "./about"

export default function Page() {
  const { space } = useSpace()

  if (!space || !space.about) return <div className="text-neutral-500">
    No about yet!
  </div>

  return <About />
}
