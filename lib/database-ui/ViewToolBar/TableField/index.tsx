

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
    <div className="flex text-sm">
      <div className="cursor-pointer mr-2" onClick={onUndo}>
        Undo
      </div>

      <div className="cursor-pointer" onClick={onRedo}>
        Redo
      </div>
    </div>
  )
}
