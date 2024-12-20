import { dateCellRenderer } from './date-cell'
import { fileCellRenderer } from './file-cell'
import { passwordCellRenderer } from './password-cell'
import { systemDateCellRenderer } from './system-date-cell'

export const cellRenderers = [
  dateCellRenderer,
  systemDateCellRenderer,
  passwordCellRenderer,
  fileCellRenderer,
]
