import { forwardRef, useCallback, useImperativeHandle } from 'react'

type DragDirection = 'top' | 'bottom' | 'left' | 'right'

export interface IScreenShotRef {
  onSave: () => Promise<void>
}

interface IScreenShotProps {
  destroySelectArea: () => void
}

const ScreenShot = forwardRef<IScreenShotRef, IScreenShotProps>(
  function ScreenShotComponent(props, propsRef) {
    const onSave = useCallback(async () => {
      // Implementation
    }, [])

    const onScreenshot = useCallback(async () => {
      // Implementation
    }, [])

    useImperativeHandle(
      propsRef,
      () => ({
        onSave: onScreenshot,
      }),
      [onScreenshot],
    )

    return (
      <div style={{ width: '100px', height: '100px', background: 'yellow' }}>
        screen-shot
      </div>
    )
  },
)

ScreenShot.displayName = 'ScreenShot'

export default ScreenShot
