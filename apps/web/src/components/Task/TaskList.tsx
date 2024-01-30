import { Box, styled } from '@fower/react'
import { Gem } from 'lucide-react'
import { it } from 'node:test'
import { Button } from 'uikit'
import { IconToken } from '../IconToken'
import { ClaimButton } from './ClaimButton'

const RewardWrapper = styled(Box, [
  'h-32',
  'roundedFull',
  'toCenter',
  'px2',
  'gap1',
  'textSM',
  'fontBold',
])

export function TaskList() {
  const list = Array(40)
    .fill(0)
    .map((_, i) => i)
  return (
    <Box>
      <Box column gap4>
        {list.map((_, i) => (
          <Box
            key={i}
            py5
            gap2
            toBetween
            borderBottom
            borderBottomNeutral200--T50
          >
            <Box column gap2>
              <Box textXL fontSemibold>
                Mind Network Crescendo | Testnet Launch
              </Box>
              <Box toCenterY gap2>
                <RewardWrapper bgAmber200>
                  <IconToken size={20} token="USDT" />
                  <Box>50 USDT</Box>
                </RewardWrapper>
                <RewardWrapper bgCyan200>
                  <Box square4>
                    <Gem size={16}></Gem>
                  </Box>
                  <Box>50 PXP</Box>
                </RewardWrapper>
              </Box>
            </Box>
            <ClaimButton taskId={i.toString()} />
          </Box>
        ))}
      </Box>
    </Box>
  )
}
