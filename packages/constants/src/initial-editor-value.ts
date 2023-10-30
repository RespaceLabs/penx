const ELEMENT_UL = 'ul'
const ELEMENT_LI = 'li'
const ELEMENT_LIC = 'lic'

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
