/** @jsx hyperscript */

import type { Editor as Slate } from 'slate'
import {
  Anchor,
  Editor,
  Focus,
  hyperscript,
  ListItem,
  ListItemText,
  OrderedList,
  SCHEMA,
  Text,
  UnorderedList,
} from '../hyperscript'
import { ListType } from '../types'
import { setListType } from './setListType'

describe('setListType', () => {
  it('should do nothing when there is no selection', () => {
    const editor = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    setListType(editor, SCHEMA, ListType.ORDERED)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should set lists types in selection', () => {
    const editor = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists A</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>Nested Lists A1</Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A1a</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A1b</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    Nested
                    <Anchor /> Lists A2
                  </Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A2a</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A2b</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    Nested
                    <Focus /> Lists A3
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists B</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists A</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>Nested Lists A1</Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A1a</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A1b</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    Nested
                    <Anchor /> Lists A2
                  </Text>
                </ListItemText>
                <OrderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A2a</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists A2b</Text>
                    </ListItemText>
                  </ListItem>
                </OrderedList>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    Nested
                    <Focus /> Lists A3
                  </Text>
                </ListItemText>
              </ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists B</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    setListType(editor, SCHEMA, ListType.ORDERED)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})
