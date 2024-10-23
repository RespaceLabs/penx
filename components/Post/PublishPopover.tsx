'use client'

import { Dispatch, SetStateAction, useState } from 'react'
import { Post, updatePostPublishStatus, usePost } from '@/hooks/usePost'
import { GateType } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { PopoverClose } from '@radix-ui/react-popover'
import LoadingDots from '../icons/loading-dots'
import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { usePublishPost } from './usePublishPost'

interface PublishConfig {
  gateType: GateType
}

interface Props {}

export function PublishPopover({}: Props) {
  const { post } = usePost()
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
      {post ? <PublishPopoverContent setOpen={setOpen} /> : <PopoverContent />}
    </Popover>
  )
}

interface PublishPopoverContentProps {
  setOpen: Dispatch<SetStateAction<boolean>>
}

function PublishPopoverContent({ setOpen }: PublishPopoverContentProps) {
  const { post } = usePost()
  const [gateType, setGateType] = useState<GateType>(
    (post.gateType as GateType) || GateType.FREE,
  )
  const { isLoading, publishPost } = usePublishPost()
  return (
    <PopoverContent align="end" className="w-[520px] flex flex-col gap-5">
      <div className="text-center text-xl font-semibold">Publish your post</div>

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
            await publishPost(post, gateType)
            updatePostPublishStatus()
            setOpen(false)
          }}
        >
          {isLoading ? <LoadingDots /> : <div>Publish</div>}
        </Button>
      </div>
    </PopoverContent>
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
        selected={value === GateType.PAID}
        title="Paid"
        description="member or minter can read this post"
        onClick={() => onSelect(GateType.PAID)}
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
