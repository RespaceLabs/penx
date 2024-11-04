export type CustomText = {
  text: string

  id?: string
  type?: any

  bold?: true
  italic?: true
  underline?: true

  /**
   * is inline code
   */
  code?: true

  strike_through?: true
  highlight?: true
  subscript?: true
  superscript?: true
  language?: string
}
