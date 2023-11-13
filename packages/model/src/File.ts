import { IFile } from '@penx/model-types'

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return bytes + ' bytes'
  } else if (bytes < 1024 * 1024) {
    const kilobytes = (bytes / 1024).toFixed(2)
    return kilobytes + ' KB'
  } else if (bytes < 1024 * 1024 * 1024) {
    const megabytes = (bytes / (1024 * 1024)).toFixed(2)
    return megabytes + ' MB'
  } else {
    const gigabytes = (bytes / (1024 * 1024 * 1024)).toFixed(2)
    return gigabytes + ' GB'
  }
}

export class File {
  constructor(private raw: IFile) {}

  get url(): string {
    if (!this?.raw?.value) return ''
    const url = URL.createObjectURL(this.raw.value)
    return url || ''
  }

  get name(): string {
    return this.raw.value.name
  }

  get size() {
    return this.raw.value.size
  }
  get sizeFormatted(): string {
    return formatFileSize(this.size)
  }
}
