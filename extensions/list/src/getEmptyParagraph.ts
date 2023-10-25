export const getEmptyParagraph = (text = '') => {
  return {
    type: 'p',
    children: [{ text }],
  }
}
