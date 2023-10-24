const ELEMENT_UL = 'unordered-list'
const ELEMENT_LI = 'list-item'
const ELEMENT_LIC = 'list-item-text'

export const INITIAL_EDITOR_VALUE = [
  {
    type: ELEMENT_UL,
    children: [
      {
        type: ELEMENT_LI,
        children: [
          {
            type: ELEMENT_LIC,
            children: [
              {
                type: 'p',
                children: [{ text: '' }],
              },
            ],
          },
        ],
      },
    ],
  },
]
