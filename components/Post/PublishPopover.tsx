'use client'

import { useState } from 'react'
import { Post } from '@/hooks/usePost'
import { GateType } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'

interface PublishConfig {
  gateType: GateType
}

interface Props {
  isPending: boolean
  post: Post
  onPublish: (config: PublishConfig) => Promise<void>
}

export function PublishPopover({ onPublish, post, isPending }: Props) {
  const [gateType, setGateType] = useState<GateType>(
    (post.gateType as GateType) || GateType.FREE,
  )
  const [isOpen, setOpen] = useState(false)
  return (
    <Popover
      open={isOpen}
      onOpenChange={(v) => {
        setOpen(v)
      }}
    >
      <PopoverTrigger asChild>
        <Button className="w-24" onClick={() => setOpen(true)}>
          Publish
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[460px] flex flex-col gap-5">
        <div className="text-center text-xl font-semibold">
          Publish your post
        </div>

        <div>
          <div className="font-semibold">Access control</div>
          <div className="text-sm leading-tight">
            Gate this post, config who can read this post.
          </div>
        </div>

        <GateTypeSelect
          value={gateType}
          onSelect={(value) => {
            console.log('===value:', value)
            setGateType(value)
          }}
        />
        <div className="flex gap-2 justify-center">
          <PopoverClose asChild>
            <Button variant="secondary" className="w-full">
              Cancel
            </Button>
          </PopoverClose>
          <Button
            className="w-full"
            onClick={async () => {
              await onPublish({
                gateType,
              })
              setOpen(false)
            }}
          >
            {isPending ? <LoadingDots color="#808080" /> : <div>Publish</div>}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface GateTypeSelectProps {
  value: GateType
  onSelect: (value: GateType) => void
}

function GateTypeSelect({ value, onSelect }: GateTypeSelectProps) {
  return (
    <div className="flex gap-2">
      <GateTypeItem
        selected={value === GateType.FREE}
        title="Free"
        description="Any one can read this post"
        onClick={() => onSelect(GateType.FREE)}
      />
      <GateTypeItem
        selected={value === GateType.MEMBER_ONLY}
        title="Member only"
        description="Only member can read this post"
        onClick={() => onSelect(GateType.MEMBER_ONLY)}
      />
    </div>
  )
}

interface GateItemTypeProps {
  selected?: boolean
  title: string
  description: string
  onClick: () => void
}

function GateTypeItem({
  selected,
  title,
  description,
  onClick,
}: GateItemTypeProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-2 p-2 flex-1 cursor-pointer',
        selected ? 'border-primary' : 'border-secondary',
      )}
      onClick={() => onClick?.()}
    >
      <div className="font-medium text-base">{title}</div>
      <div className="text-xs">{description}</div>
    </div>
  )
}
