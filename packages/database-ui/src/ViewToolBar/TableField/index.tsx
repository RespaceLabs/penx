import { Box } from '@fower/react'

export const TableField = () => {
  const onUndo = () => {
    // TODO
    /*
      if(canUndo){
        undo()
      }
    */
  }

  const onRedo = () => {
    // TODO
    /*
      if(canRedo){
        redo()
      }
    */
  }

  return (
    <Box flex textSM>
      <Box cursor="pointer" mr="8px" onClick={onUndo}>
        Undo
      </Box>

      <Box cursor="pointer" onClick={onRedo}>
        Redo
      </Box>
    </Box>
  )
}
