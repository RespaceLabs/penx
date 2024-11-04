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

  // console.log('===nodeProps:', nodeProps.)

  if (type === 'h1') {
    return (
      <h1
        {...attributes}
        {...nodeProps}
        className={cn(
          'leading-tight text-[28px] mb-0.5 font-bold',
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
          'leading-tight text-[24px] mb-0.5 font-bold',
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
          'leading-tight text-[20px] mb-0.5 font-bold',
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
          'leading-tight text-[18px] mb-0.5 font-bold',
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
          'leading-tight text-[16px] mb-0.5 font-bold',
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
        'leading-tight text-[16px] mb-0.5 font-bold',
        nodeProps?.className,
      )}
    >
      {children}
    </h5>
  )
}
