import { dateCellRenderer } from './date-cell'
import { fileCellRenderer } from './file-cell'
import { multipleSelectCellRenderer } from './multiple-select-cell'
import { passwordCellRenderer } from './password-cell'
import { RateCellRenderer } from './rate-cell'
import { singleSelectCellRenderer } from './single-select-cell'
import { systemDateCellRenderer } from './system-date-cell'

export const cellRenderers = [
  dateCellRenderer,
  singleSelectCellRenderer,
  multipleSelectCellRenderer,
  systemDateCellRenderer,
  passwordCellRenderer,
  RateCellRenderer,
  fileCellRenderer,
]
