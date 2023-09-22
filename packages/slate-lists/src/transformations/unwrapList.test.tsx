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
import { unwrapList } from './unwrapList'

describe('unwrapList', () => {
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

    unwrapList(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert the only selected list item into a paragraph', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>
                lorem
                <Cursor /> ipsum
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
            lorem
            <Cursor /> ipsum
          </Text>
        </Paragraph>
      </Editor>
    ) as unknown as Slate

    unwrapList(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert middle list item into a paragraph', () => {
    const editor = (
      <Editor normalizeNode="disabled">
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>dolor</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>
                lorem
                <Cursor /> ipsum
              </Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>sit</Text>
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
              <Text>dolor</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            lorem
            <Cursor /> ipsum
          </Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>sit</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    unwrapList(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert nested middle list item into a paragraph', () => {
    const editor = (
      <Editor normalizeNode="disabled">
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
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>
                    ipsum
                    <Cursor />
                  </Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>dolor</Text>
                </ListItemText>
              </ListItem>
            </OrderedList>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor</Text>
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
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>ipsum</Text>
            </ListItemText>
            <OrderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem</Text>
                </ListItemText>
              </ListItem>
            </OrderedList>
          </ListItem>
        </UnorderedList>
        <Paragraph>
          <Text>
            ipsum
            <Cursor />
          </Text>
        </Paragraph>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text>dolor</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor</Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    unwrapList(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })

  it('should convert a multi-item list into paragraphs', () => {
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

    unwrapList(editor, SCHEMA)

    expect(editor.children).toEqual(expected.children)
    expect(editor.selection).toEqual(expected.selection)
  })
})
