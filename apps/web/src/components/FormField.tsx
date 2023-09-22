import React, { forwardRef, ReactNode } from 'react'
import { InformationCircleSolid } from '@bone-ui/icons'
import { Box, FowerHTMLProps } from '@fower/react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from 'uikit'

export interface FormFieldProps extends FowerHTMLProps<'div'> {
  showLabel?: boolean
  layout?: 'horizontal' | 'vertical' | 'inline'
  error?: ReactNode
  label?: ReactNode
  help?: ReactNode
  description?: ReactNode
  touched?: boolean
  wrapper?: ReactNode
  renderLabel?: () => ReactNode
}

export const FormField = forwardRef<HTMLDivElement, FormFieldProps>(
  function FormField(props, ref) {
    const {
      children,
      showLabel = true,
      renderLabel,
      layout = 'vertical',
      error,
      label,
      help,
      description,
      touched,
      wrapper,
      ...rest
    } = props

    // if (!wrapper) return <>{children}</>
    return (
      <Box ref={ref} relative flex mb5 column={layout === 'vertical'} {...rest}>
        {renderLabel?.()}
        {showLabel && label && (
          <Box
            toCenterY
            spaceX1
            mb2={layout === 'vertical'}
            toRight={layout === 'horizontal'}
            pr2={layout !== 'vertical'}
            w-100={layout === 'horizontal'}
          >
            {label && (
              <Box as="label" leading-1em toCenterY textLG black>
                {label}
              </Box>
            )}

            {description && (
              <HoverCard>
                <HoverCardTrigger>
                  <InformationCircleSolid gray600 cursorPointer size={20} />
                </HoverCardTrigger>
                <HoverCardContent>{description}</HoverCardContent>
              </HoverCard>
            )}
          </Box>
        )}

        {!!help && (
          <Box textBase mb4 gray500>
            {help}
          </Box>
        )}
        <Box className="bone-form-field-control" column flex-1 relative>
          <Box toCenterY toLeft>
            {children}
          </Box>
          {error && touched && (
            <Box h-1em red400 bottom="-1.1em" left0 text="0.9em" absolute>
              {error}
            </Box>
          )}
        </Box>
      </Box>
    )
  },
)
