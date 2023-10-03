import { ElementType } from '../custom-types'

export const getEmptyParagraph = () => {
  return {
    type: ElementType.p,
    children: [{ text: '' }],
  }
}
