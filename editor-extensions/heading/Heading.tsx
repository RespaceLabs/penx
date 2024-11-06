import { ElementProps } from '@/lib/extension-typings'
import { cn } from '@/lib/utils'
import { HeadingElement } from './types'

export const Heading = ({
  attributes,
  element,
  children,
  nodeProps,
}: ElementProps<HeadingElement>) => {
  const { type } = element

  if (type === 'h1') {
    return (
      <h1
        {...attributes}
        {...nodeProps}
        className={cn(
          'relative leading-tight text-[28px] mt-[1em] mb-[0.5em] font-bold',
          nodeProps?.className,
        )}
      >
        {children}
      </h1>
    )
  }

  if (type === 'h2') {
    return (
      <h2
        {...attributes}
        {...nodeProps}
        className={cn(
          'relative leading-tight text-[24px] mt-[1em] mb-[0.5em] font-bold',
          nodeProps?.className,
        )}
      >
        {children}
      </h2>
    )
  }

  if (type === 'h3') {
    return (
      <h3
        {...attributes}
        {...nodeProps}
        className={cn(
          'relative leading-tight text-[20px] mt-[1em] mb-[0.5em] font-bold',
          nodeProps?.className,
        )}
      >
        {children}
      </h3>
    )
  }

  if (type === 'h4') {
    return (
      <h4
        {...attributes}
        {...nodeProps}
        className={cn(
          'relative leading-tight text-[18px] mt-[1em] mb-[0.5em] font-bold',
          nodeProps?.className,
        )}
      >
        {children}
      </h4>
    )
  }

  if (type === 'h5') {
    return (
      <h5
        {...attributes}
        {...nodeProps}
        className={cn(
          'relative leading-tight text-[16px] mt-[1em] mb-[0.5em] font-bold',
          nodeProps?.className,
        )}
      >
        {children}
      </h5>
    )
  }

  return (
    <h5
      {...attributes}
      {...nodeProps}
      className={cn(
        'relative leading-tight text-[16px] mt-[1em] mb-[0.5em] font-bold',
        nodeProps?.className,
      )}
    >
      {children}
    </h5>
  )
}
