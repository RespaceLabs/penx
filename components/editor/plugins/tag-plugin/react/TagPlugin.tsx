import { toPlatePlugin } from '@udecode/plate-common/react'
import { BaseTagInputPlugin, BaseTagPlugin } from '../lib'

export const TagPlugin = toPlatePlugin(BaseTagPlugin)

export const TagInputPlugin = toPlatePlugin(BaseTagInputPlugin)
