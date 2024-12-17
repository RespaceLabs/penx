// import { getNodeByPath } from '@/components/editor/lib/getNodeByPath'
import { ELEMENT_LI, ELEMENT_LIC } from '@/lib/constants'
import { INode, NodeType } from '@/lib/model'
import { uniqueId } from '@/lib/unique-id'
import _ from 'lodash'
import { createEditor, Editor, Path, Transforms } from 'slate'
import {
  ListContentElement,
  ListItemElement,
  TitleElement,
  UnorderedListElement,
} from './list-types'

function isListItemElement(node: any): node is ListItemElement {
  return node?.type === ELEMENT_LI
}

function isListContentElement(node: any): node is ListContentElement {
  return node?.type === ELEMENT_LIC
}

// TODO: should handle tags
export function slateToNodes(
  value: any,
  node?: INode,
  allNodes: INode[] = [],
): INode[] {
  //
  return []
}
