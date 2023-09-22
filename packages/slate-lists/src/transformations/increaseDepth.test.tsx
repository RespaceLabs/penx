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
import { increaseDepth } from './increaseDepth'

describe('increaseDepth - no selected items', () => {
  it('Does nothing when there is no selection', () => {
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

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('increaseDepth - single item selected', () => {
  it('Does nothing when there is no preceding sibling list item', () => {
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

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Moves list-item to the child list of a preceding sibling list item', () => {
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

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates a child list in preceding sibling list item and moves list-item there', () => {
    const editor = (
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

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates a child list in preceding sibling list item and moves list-item there, maintaining list type', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <OrderedList>
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
        </OrderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor normalizeNode="disabled">
        <OrderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    dolor sit amet
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
            </OrderedList>
          </ListItem>
        </OrderedList>
      </Editor>
    ) as unknown as Slate

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('increaseDepth - multiple items selected', () => {
  it('Increases depth of all indentable list items in selection that have no list items ancestors in selection (A)', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Anchor />
                aaa
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
              <Text>
                ccc
                <Focus />
              </Text>
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
              <Text>
                <Anchor />
                aaa
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
                  <Text>
                    ccc
                    <Focus />
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Increases depth of all indentable list items in selection that have no list items ancestors in selection (B)', () => {
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
                </OrderedList>
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
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>Nested Lists C</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('increaseDepth - multiple items and paragraphs selected', () => {
  it('Converts paragraphs into lists items and merges them together', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <Paragraph>
          <Text>
            <Anchor />
            aaa
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
          <ListItem>
            <ListItemText>
              <Text>ddd</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            eee
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
              <Text>
                <Anchor />
                aaa
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>bbb</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>ccc</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>ddd</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
        </UnorderedList>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                eee
                <Focus />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    increaseDepth(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})
