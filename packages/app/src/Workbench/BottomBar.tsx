import { forwardRef, useState } from 'react'
import DatePicker from 'react-datepicker'
import { Box, css, FowerHTMLProps } from '@fower/react'
import { Plus } from 'lucide-react'
import { Button, ButtonProps } from 'uikit'
import { useBottomBarDrawer } from '@penx/hooks'
import { IconCalendar, IconTodo } from '@penx/icons'
import { useNodeContext } from '@penx/node-hooks'
import { store } from '@penx/store'
import { DailyShortcut } from '@penx/widget'
import { BottomBarDrawer } from './BottomBarDrawer/BottomBarDrawer'

interface ActionButtonProps extends ButtonProps, FowerHTMLProps<'button'> {
  //
}

function ActionButton({ ...rest }: ActionButtonProps) {
  return (
    <Button
      display={['flex', 'flex', 'none']}
      // size="sm"
      // colorScheme="white"
      // variant="ghost"
      variant="ghost"
      isSquare
      roundedFull
      bgGray200--active
      shadow="0px 1px 4px 0 rgba(0, 0, 0, 0.2)"
      {...rest}
    ></Button>
  )
}

export function BottomBar() {
  const { isOpen, close, open } = useBottomBarDrawer()
  const { node } = useNodeContext()

  if (node?.isDatabase) return null

  return (
    <>
      <BottomBarDrawer />

      <Box fixed left3 bottom3 toCenterY gap2 zIndex-100>
        <ActionButton
          onClick={() => {
            if (store.router.isTodos()) {
              store.node.selectDailyNote()
            } else {
              store.router.routeTo('TODOS')
            }
          }}
        >
          <IconTodo size={24} stroke="gray500" />
        </ActionButton>

        <GoToDay />
      </Box>

      <Button
        display={['flex', 'flex', 'none']}
        fixed
        bottom3
        // left-50p
        right3
        // translateX={['-50%']}
        colorScheme="white"
        size={56}
        isSquare
        roundedFull
        shadow2XL
        bgGray200--hover
        bgGray200--active
        overflowHidden
        zIndex-100
        onClick={() => open()}
      >
        <Box gray300 inlineFlex>
          <Plus />
        </Box>
      </Button>
    </>
  )
}

const CustomInput = forwardRef<HTMLDivElement, any>(function CustomInput(
  { onClick },
  ref,
) {
  return (
    <Box ref={ref} gray500 inlineFlex cursorPointer ml2 onClick={onClick}>
      <ActionButton>
        <IconCalendar size={24} stroke="gray500" />
      </ActionButton>
    </Box>
  )
})

function GoToDay() {
  const { node } = useNodeContext()
  const [startDate, setStartDate] = useState(
    node?.date ? new Date(node.date) : new Date(),
  )

  return (
    <DatePicker
      selected={startDate}
      // withPortal
      calendarClassName={css('pb-30')}
      onChange={(date) => {
        setStartDate(date!)
        if (date) {
          store.node.selectDailyNote(date)
        }
      }}
      customInput={<CustomInput />}
    >
      <Box absolute bottom2 textXS>
        <DailyShortcut date={node?.date} />
      </Box>
    </DatePicker>
  )
}
