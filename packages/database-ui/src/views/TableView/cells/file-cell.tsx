import { Box } from '@fower/react'
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
import { Spinner } from 'uikit'
import { GoogleDrive } from '@penx/google-drive'
import { db } from '@penx/local-db'
import { getAuthorizedUser } from '@penx/storage'

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
  const { fileHash, googleDriveFileId } = props
  // console.log('=========ImagePreview props:', props)

  const { data, isLoading, error } = useQuery(['file', fileHash], async () => {
    if (props.url) return props.url
    let rawFile: File
    const file = await db.file.where({ fileHash }).first()
    if (file) {
      rawFile = file.value
    } else {
      const { google } = await getAuthorizedUser()
      const drive = new GoogleDrive(google.access_token)
      rawFile = await drive.getFile(googleDriveFileId)
    }

    const url = URL.createObjectURL(rawFile)
    return url
  })

  // console.log('==============error:', error)

  if (isLoading) {
    return (
      <Box>
        <Spinner></Spinner>
      </Box>
    )
  }
  if (!data) {
    return <Box>Loading file error!</Box>
  }

  return (
    <Box inlineFlex>
      <Box as="img" cursorPointer w-100p maxW-400 src={data} />
    </Box>
  )
}
