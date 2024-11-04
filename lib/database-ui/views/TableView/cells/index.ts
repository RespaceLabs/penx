import { dateCellRenderer } from './date-cell'
import { fileCellRenderer } from './file-cell'
import { multipleSelectCellRenderer } from './multiple-select-cell'
import { noteCellRenderer } from './note-cell'
import { passwordCellRenderer } from './password-cell'
import { RateCellRenderer } from './rate-cell'
import { singleSelectCellRenderer } from './single-select-cell'
import { systemDateCellRenderer } from './system-date-cell'
import { todoSourceCellRenderer } from './todo-source-cell'

export const cellRenderers = [
  noteCellRenderer,
  dateCellRenderer,
  singleSelectCellRenderer,
  multipleSelectCellRenderer,
  systemDateCellRenderer,
  passwordCellRenderer,
  RateCellRenderer,
  fileCellRenderer,
  todoSourceCellRenderer,
]
