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
import { normalizeNode } from '../normalizeNode'
import { splitListItem } from './splitListItem'

describe('splitListItem - no selected items', () => {
  it('Does nothing when there is no selection', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
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

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Does nothing when there are no list items in selection', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <Paragraph>
          <Text>
            lorem
            <Cursor />
          </Text>
        </Paragraph>
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
        <Paragraph>
          <Text>
            lorem
            <Cursor />
          </Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('splitListItem - collapsed selection', () => {
  it('Creates new empty sibling list item when cursor is at the end of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
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
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                <Cursor />
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates new empty sibling list item when cursor is at the beginning of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                <Cursor />
                lorem ipsum
              </Text>
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
              <Text />
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                <Cursor />
                lorem ipsum
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates a new sibling list item when cursor is in the middle of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                lorem
                <Cursor />
                ipsum
              </Text>
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
              <Text>lorem</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                <Cursor />
                ipsum
              </Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('splitListItem - collapsed selection - nested lists', () => {
  it('Creates new sibling list item in nested list when cursor is at the end of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
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
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
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
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem ipsum</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates new sibling list item in nested list when cursor is at the beginning of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                    lorem ipsum
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
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
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text />
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                    lorem ipsum
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('Creates new sibling list item in nested list when cursor is in the middle of an item', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    lorem
                    <Cursor />
                    ipsum
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
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
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                    ipsum
                  </Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('splitListItem - collapsed selection - deeply nested lists', () => {
  it('Creates new sibling list item in nested list when cursor is at the end of an item with nested list', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    lorem ipsum
                    <Cursor />
                  </Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>lorem</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>ipsum</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
            </OrderedList>
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
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem ipsum</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                  </Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>lorem</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>ipsum</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
            </OrderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})

describe('splitListItem - expanded selection - deeply nested lists', () => {
  it('Removes selected text, creates new sibling list item in nested list when cursor is at the end of an item with nested list', () => {
    // it's an interesting case because Transforms.delete will break <ListItem> in half,
    // leaving <UnorderedList> as its only child which will be normalized by withLists
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Anchor />
                    lorem ipsum
                  </Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    lorem ipsum
                    <Focus />
                  </Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>lorem</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>ipsum</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
            </OrderedList>
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
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text />
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    <Cursor />
                  </Text>
                </ListItemText>
                <UnorderedList>
                  <ListItem>
                    <ListItemText>
                      <Text>lorem</Text>
                    </ListItemText>
                  </ListItem>
                  <ListItem>
                    <ListItemText>
                      <Text>ipsum</Text>
                    </ListItemText>
                  </ListItem>
                </UnorderedList>
              </ListItem>
            </OrderedList>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    splitListItem(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})
