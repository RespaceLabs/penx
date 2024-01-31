import { Box, styled } from '@fower/react'
import { Gem } from 'lucide-react'
import { Button, Spinner } from 'uikit'
import { trpc } from '@penx/trpc-client'
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
  const { isLoading, data = [] } = trpc.task.all.useQuery()

  if (isLoading) {
    return (
      <Box minH-60vh toCenter>
        <Spinner />
      </Box>
    )
  }
  return (
    <Box>
      <Box column gap4>
        {data.map((item, i) => (
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
                {item.title}
              </Box>
              <Box column gap2>
                {item.issueUrl && (
                  <Box toCenterY gap2 gray800>
                    <Box>GitHub issue:</Box>
                    <Box gray500 as="a" href={item.issueUrl}>
                      {item.issueUrl}
                    </Box>
                  </Box>
                )}

                {item.figmaUrl && (
                  <Box toCenterY gap2 gray800>
                    <Box>Figma:</Box>
                    <Box as="a" gray500 href={item.figmaUrl}>
                      {item.figmaUrl}
                    </Box>
                  </Box>
                )}
              </Box>
              <Box toCenterY gap2>
                <RewardWrapper bgAmber200>
                  <IconToken size={20} token="USDT" />
                  <Box>{item.usdReward} USDT</Box>
                </RewardWrapper>
                <RewardWrapper bgCyan200>
                  <Box square4>
                    <Gem size={16}></Gem>
                  </Box>
                  <Box>{item.tokenReward} PXP</Box>
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
