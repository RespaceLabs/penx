import { Editor } from 'slate'
import type { AutoformatRule } from '@penx/autoformat'
import { PenxEditor } from '@penx/editor-common'
import {
  BlockElement,
  OnBlur,
  OnKeyDown,
  RegisterBlockOptions,
  RegisterComponentOptions,
  SettingsSchema,
} from '@penx/extension-typings'

function isBooleanTrue(value: any): value is true {
  return typeof value === 'boolean' && value === true
}

export type Command = {
  id: string
  name: string
  pluginId?: string
  handler: () => void
}

export class ExtensionStore {
  commands: Command[] = []

  settingMap = new Map<string, SettingsSchema>()

  componentMap = new Map<string, Array<RegisterComponentOptions>>()

  blockMap = new Map<string, RegisterBlockOptions>()

  //-----------------------------------

  rules: AutoformatRule[] = []

  withFns: ((editor: PenxEditor) => Editor)[] = []

  elementMaps: Record<string, BlockElement> = {}

  onKeyDownFns: OnKeyDown[] = []

  onBlurFns: OnBlur[] = []

  inlineTypes: string[] = []

  voidTypes: string[] = []

  addCommand(command: Command) {
    this.commands = [...this.commands, command]
  }

  addSetting(pluginId: string, settings: SettingsSchema) {
    this.settingMap.set(pluginId, settings)
  }

  addComponent(pluginId: string, component: RegisterComponentOptions) {
    const components = this.componentMap.get(pluginId) || []

    this.componentMap.set(pluginId, [...components, component])
  }

  addBlock(pluginId: string, block: RegisterBlockOptions) {
    this.blockMap.set(pluginId, block)
    const { elements = [] } = block

    for (const ele of elements) {
      // get inline types
      if (isBooleanTrue(ele.isInline)) this.inlineTypes.push(ele.type)

      // get void types
      if (isBooleanTrue(ele.isVoid)) this.voidTypes.push(ele.type)

      // set element maps
      this.elementMaps[ele.type] = ele
    }

    if (block.with) {
      if (Array.isArray(block.with)) {
        this.withFns.push(...block.with)
      } else {
        this.withFns.push(block.with)
      }
    }

    if (block.handlers?.onKeyDown) {
      this.onKeyDownFns.push(block.handlers.onKeyDown)
    }

    if (block.handlers?.onBlur) {
      this.onBlurFns.push(block.handlers.onBlur)
    }

    if (block.autoformatRules) {
      this.rules = [...this.rules, ...block.autoformatRules]
    }
  }
}

export const extensionStore = new ExtensionStore()
