import { GoogleDrive } from '@/lib/google-drive'
import { db } from '@/lib/local-db'

import {
  CustomCell,
  CustomRenderer,
  drawTextCell,
  getMiddleCenterBias,
  GridCellKind,
  measureTextCached,
  TextCellEntry,
} from '@glideapps/glide-data-grid'
import { useQuery } from '@tanstack/react-query'

interface FileCellProps {
  kind: 'file-cell'
  fileHash: string
  googleDriveFileId: string
  url: string
  name?: string
}

export type FileCell = CustomCell<FileCellProps>

export const fileCellRenderer: CustomRenderer<FileCell> = {
  kind: GridCellKind.Custom,
  isMatch: (c): c is FileCell => (c.data as any).kind === 'file-cell',
  draw: (args, cell) => {
    const { ctx, rect, theme, imageLoader, col, row } = args
    const { url, name } = cell.data

    const xPad = theme.cellHorizontalPadding

    const radius = Math.min(12, rect.height / 2 - theme.cellVerticalPadding)

    const drawX = rect.x + xPad

    const imageResult = imageLoader.loadOrGetImage(url, col, row)

    ctx.save()
    ctx.beginPath()
    ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2)
    ctx.globalAlpha = 0.2
    ctx.fill()
    ctx.globalAlpha = 1

    if (imageResult !== undefined) {
      ctx.save()
      ctx.beginPath()
      ctx.arc(drawX + radius, rect.y + rect.height / 2, radius, 0, Math.PI * 2)
      // ctx.clip()

      ctx.drawImage(
        imageResult,
        drawX,
        rect.y + rect.height / 2 - radius,
        radius * 2,
        radius * 2,
      )

      ctx.restore()
    }

    if (name !== undefined) {
      ctx.font = theme.baseFontFull
      ctx.fillStyle = theme.textDark
      ctx.fillText(
        name,
        drawX + radius * 2 + xPad,
        rect.y + rect.height / 2 + getMiddleCenterBias(ctx, theme),
      )
    }

    ctx.restore()

    return true
  },
  provideEditor: () => ({
    editor: (p) => {
      const { onChange, value } = p
      return <ImagePreview {...value.data} />
    },
  }),
}

function ImagePreview(props: FileCellProps) {
  return <div>TODO:...</div>
}
