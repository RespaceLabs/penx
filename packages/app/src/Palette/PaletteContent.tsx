import { Dispatch, SetStateAction } from 'react'
import { styled } from '@fower/react'
import { Command } from '@penx/cmdk'
import { CommandList } from './CommandList'
import { ContentWrapper } from './ContentWrapper'
import { NodeList } from './NodeList'
import { SearchByCell } from './SearchByCell'
import { SearchByTag } from './SearchByTag'

const StyledCommandGroup = styled(Command.Group)

interface Props {
  isMobile?: boolean
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  focusInput: () => void
  close: () => void
}

export function PaletteContent({
  focusInput,
  close,
  search,
  setSearch,
}: Props) {
  const isCommand = search.startsWith('>')
  const isTag = search.startsWith('#')

  if (isCommand) {
    return (
      <ContentWrapper>
        <CommandList q={search} close={close} setSearch={setSearch} />
      </ContentWrapper>
    )
  }

  if (isTag) {
    const isDatabase = /^#\S*$/.test(search)

    if (isDatabase) {
      return (
        <ContentWrapper>
          <SearchByTag
            q={search}
            setSearch={setSearch}
            close={close}
            afterSearch={() => {
              focusInput()
            }}
          />
        </ContentWrapper>
      )
    }

    return (
      <ContentWrapper overflowXHidden>
        <SearchByCell
          q={search}
          setSearch={setSearch}
          close={close}
          afterSearch={() => {
            focusInput()
          }}
        />
      </ContentWrapper>
    )
  }

  return (
    <ContentWrapper>
      <StyledCommandGroup>
        <NodeList q={search} setSearch={setSearch} close={close} />
      </StyledCommandGroup>
    </ContentWrapper>
  )
}
