import React from 'react'
import { Box } from '@fower/react'

export function HowToGet() {
  return (
    <Box column bgGray100 rounded3XL p5 maxW-500 gap4>
      <Box fontSemibold textXL gray600 textCenter>
        How to get $INK?
      </Box>
      <Box as="ul" listInside listDisc column gap2 textSM gray500>
        <Box as="li">
          Become{' '}
          <Box as="span" fontBold black>
            early adopter
          </Box>{' '}
          and taking notes with PenX.
        </Box>

        <Box as="li">
          Submit a Feedback, Bug in{' '}
          <Box
            as="a"
            target="_blank"
            href="https://github.com/penxio/penx/issues"
            fontSemibold
            black
          >
            Penx GitHub issue
          </Box>
          .
        </Box>

        <Box as="li">Setup sync server for PenX</Box>
        <Box as="li">Enable GitHub Backup When using PenX</Box>
        <Box as="li">
          Completing PenX bounty task in{' '}
          <Box
            as="a"
            target="_blank"
            href="https://github.com/penxio/penx/issues?q=is%3Aissue+is%3Aopen+label%3A%22%F0%9F%92%8E+Bounty%22"
            black
            fontSemibold
          >
            penxio/penx
          </Box>
          .
        </Box>
      </Box>
    </Box>
  )
}
