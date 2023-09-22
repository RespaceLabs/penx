import { ElementType } from '@penx/editor-shared'
import { EditorPlugin } from '@penx/editor-types'
import { IconCode } from '../../components/icons/IconCode'
import { FrontMatterBlock } from './ui/FrontMatterBlock'
import { FrontMatterLine } from './ui/FrontMatterLine'
import { withFrontMatter } from './withFrontMatter'

export default function frontMatter(): EditorPlugin {
  return {
    with: withFrontMatter,
    elements: [
      {
        name: 'Front Matter',
        icon: IconCode,
        shouldNested: true,
        type: ElementType.front_matter_block,
        defaultValue: {
          type: ElementType.front_matter_block,
          language: 'yaml',
          children: [
            {
              type: ElementType.front_matter_line,
              children: [{ text: '' }],
            },
          ],
        },
        component: FrontMatterBlock,
      },
      {
        type: ElementType.front_matter_line,
        component: FrontMatterLine,
      },
    ],
  }
}
