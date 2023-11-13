import { useState } from 'react'
import { Box } from '@fower/react'
import { ExtensionFilter } from './ExtensionFilter'
import { ExtensionList } from './ExtensionList'

export function MarketplaceSidebar() {
  const [value, setValue] = useState('Development')
  return (
    <Box bgGray100 h-100p w-300>
      <ExtensionFilter
        value={value}
        onChange={setValue}
        options={[
          { label: 'Marketplace', value: 'Marketplace' },
          { label: 'Installed', value: 'Installed' },
          { label: 'Development', value: 'Development' },
        ]}
      />
      <ExtensionList />
    </Box>
  )
}
