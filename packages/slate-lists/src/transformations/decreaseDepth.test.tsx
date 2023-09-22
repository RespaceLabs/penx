/** @jsx hyperscript */

import type { Editor as Slate } from 'slate'
import {
  Anchor,
  Cursor,
  Editor,
  Focus,
  hyperscript,
  ListItem,
  ListItemText,
  OrderedList,
  Paragraph,
  SCHEMA,
  Text,
  UnorderedList,
} from '../hyperscript'
import { decreaseDepth } from './decreaseDepth'

describe('decreaseDepth', () => {
  it('should do nothing when there is no selection', () => {
    const editor = (
      <Editor normalizeNode="disabled">
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
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should do nothing when there are no list items is the selection', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            <Anchor />
            this is a paragraph
            <Focus />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            <Anchor />
            this is a paragraph
            <Focus />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert the selected list item to a paragraph when there is no grandparent list', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                lorem ipsum
                <Cursor />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <Paragraph>
          <Text>
            lorem ipsum
            <Cursor />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should move the selected list-item to the grandparent list', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>ipsum</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    dolor sit amet
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>ipsum</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                dolor sit amet
                <Cursor />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should move the selected list item to the grandparent list and removes the parent list if empty', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    dolor sit amet
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                dolor sit amet
                <Cursor />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should move the selected list-item to the grandparent list and succeeding siblings into a new nested list', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>aaa</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    dolor sit amet
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>bbb</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>ccc</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>aaa</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                dolor sit amet
                <Cursor />
              </Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>bbb</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>ccc</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert the selected list-item into a paragraph, move it out of the list and move succeeding siblings into a new list', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>aaa</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                dolor sit amet
                <Cursor />
              </Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>bbb</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>ccc</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>aaa</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            dolor sit amet
            <Cursor />
          </Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>bbb</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>ccc</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should decrease depth of all selected list items in selection that have no list items ancestors in selection', () => {
    const editor = (
      <Editor normalizeNode="disabled">
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
                <OrderedList>
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
                </OrderedList>
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
                  <Text>Nested Lists A3</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists B</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>Nested Lists B1</Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>Nested Lists B1a</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>
                        Nested Lists
                        <Focus /> B1b
                      </Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>Nested Lists B2</Text>
                </ListItemText>
              </ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists C</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
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
                <OrderedList>
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
                </OrderedList>
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
              <Text>Nested Lists A3</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>Nested Lists B</Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists B1</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>Nested Lists B1a</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    Nested Lists
                    <Focus /> B1b
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists B2</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists C</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert list items to paragraphs', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Focus />
                Hello
              </Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>World</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                Here I am
                <Anchor />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <Paragraph>
          <Text>
            <Focus />
            Hello
          </Text>
        </Paragraph>
        <Paragraph>
          <Text>World</Text>
        </Paragraph>
        <Paragraph>
          <Text>
            Here I am
            <Anchor />
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as Slate

    decreaseDepth(editor, SCHEMA, [0, 0])
    decreaseDepth(editor, SCHEMA, [1, 0])
    decreaseDepth(editor, SCHEMA, [2, 0])

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})
