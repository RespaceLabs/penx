import { Box } from '@fower/react'
import { BasicLayout } from '~/layouts/BasicLayout'

export default function Page() {
  const items = [
    {
      title: '2024 Q1',
      cardTitle: 'Core features design and development',
      cardDetailedText: `
        Complete core features design and development of PenX.
      `,
      events: [
        'Truly own you data',
        'Smart tags and database',
        'Daily notes workflow',
        'First class support for To-dos',
      ],
    },
    {
      title: '2024 Q2',
      cardTitle: 'Data sync and backup',
      cardDetailedText: `
        Make data sync easily and support backup data by version-control
      `,
      events: [
        'Create a decentralized and stable Sync sever.',
        'Easy backup data to Github or blockchain',
      ],
    },

    {
      title: '2024 Q3',
      cardTitle: 'Release Mobile App',
      cardDetailedText: `
        Release the mobile app, include iOS/Android App.
      `,
      events: ['iOS App', 'Android App', 'Improve UX in PWA'],
    },

    {
      title: '2024 Q4',
      cardTitle: 'Release Token and Airdrops',
      cardDetailedText: 'Airdrops for early adopter and contributors.',
      events: [
        'PenX Believer NFT holder',
        '$INK token holders',
        'Early adopter who using PenX',
        'contributors/developers for PenX',
        'People who provide sync servers for PenX',
        'People who provide AI provider for PenX',
      ],
    },
  ]

  return (
    <Box
      w={['100%', 600]}
      column
      gap20
      my20
      borderLeft-4
      borderGray200--T40
      relative
      py10
    >
      {items.map((item, i) => (
        <Box key={i} relative column gap4>
          <Box circle-10 bgGray300 absolute left--7></Box>
          <Box
            absolute
            left--240
            w-240
            toRight
            pr-60
            leadingNone
            text3XL
            mt--10
          >
            {item.title}
          </Box>
          <Box mt--8 pl-60 column gap3>
            <Box fontBold text2XL leadingNone>
              {item.cardTitle}
            </Box>
            <Box leadingNormal gray600>
              {item.cardDetailedText}
            </Box>
            <Box as="ul" gray600 column gap2 mt2 listOutside ml4>
              {item.events.map((event, i) => (
                <Box key={i} as="li">
                  {event}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  )
}

Page.Layout = BasicLayout
