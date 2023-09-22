/** @jsx hyperscript */

import { Editor as Slate } from 'slate'
import {
  Editor,
  hyperscript,
  Link,
  ListItem,
  ListItemText,
  OrderedList,
  Paragraph,
  Text,
  UnorderedList,
  Untyped,
} from './hyperscript'
import { normalizeNode } from './normalizeNode'

describe('withLists', () => {
  describe('normalizeListChildren', () => {
    it('should convert paragraph into list-item when it is a child of a list', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem ipsum</Text>
              </ListItemText>
            </ListItem>
            <Paragraph>
              <Text>dolor</Text>
            </Paragraph>
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
                <Text>dolor</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should wrap list in list-item when it is a child of a list', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem ipsum</Text>
              </ListItemText>
            </ListItem>
            <UnorderedList>
              <ListItem>
                <ListItemText>
                  <Text>lorem ipsum</Text>
                </ListItemText>
              </ListItem>
            </UnorderedList>
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
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeListItemChildren', () => {
    it('should lift up list-items when they are children of list-item', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem ipsum</Text>
              </ListItemText>
              <ListItem>
                <ListItemText>
                  <Text>dolor</Text>
                </ListItemText>
              </ListItem>
              <ListItem>
                <ListItemText>
                  <Text>sit</Text>
                </ListItemText>
              </ListItem>
            </ListItem>
            <ListItem>
              <Text>amet</Text>
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
                <Text>dolor</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Text>sit</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Text>amet</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should ormalize paragraph children of list items', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <Paragraph>
                <Paragraph>
                  <Text>lorem</Text>
                </Paragraph>
              </Paragraph>
            </ListItem>
            <ListItem>
              <Paragraph>
                <Text>ipsum</Text>
              </Paragraph>
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
                <Text>ipsum</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should wrap extra list-item-text in list-item and lifts it up when it is a child of list-item', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem ipsum</Text>
              </ListItemText>
              <ListItemText>
                <Text>dolor sit</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <Text>amet</Text>
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
                <Text>dolor sit</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Text>amet</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should wrap inline list-item children in list-item-text', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <Link href="https://example.com">
                <Text>lorem ipsum</Text>
              </Link>
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
                <Link href="https://example.com">
                  <Text>lorem ipsum</Text>
                </Link>
                <Text />
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should wrap inline list-item children and sibling texts in list-item-text', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <Text>lorem</Text>
              <Link href="https://example.com">
                <Text>ipsum</Text>
              </Link>
              <Text>dolor</Text>
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
                <Link href="https://example.com">
                  <Text>ipsum</Text>
                </Link>
                <Text>dolor</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should add missing type attribute to block list-item children', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <Untyped>
                <Text>lorem ipsum</Text>
              </Untyped>
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

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeListItemTextChildren', () => {
    it('should unwrap block children of list-item-text elements', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Paragraph>
                  <Text>lorem ipsum</Text>
                </Paragraph>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Paragraph>
                  <Paragraph>
                    <Text>dolor sit amet</Text>
                  </Paragraph>
                </Paragraph>
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
                <Text>dolor sit amet</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeOrphanListItem', () => {
    it('should convert orphan list-item into paragraph', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <ListItem>
            <ListItemText>
              <Text>lorem ipsum</Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text>dolor sit</Text>
            </ListItemText>
          </ListItem>
        </Editor>
      ) as unknown as Slate

      const expected = (
        <Editor>
          <Paragraph>
            <Text>lorem ipsum</Text>
          </Paragraph>
          <Paragraph>
            <Text>dolor sit</Text>
          </Paragraph>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeOrphanListItemText', () => {
    it('should convert orphan list-item-text into paragraph', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <ListItemText>
            <Text>lorem ipsum</Text>
          </ListItemText>
          <ListItemText>
            <Text>dolor sit</Text>
          </ListItemText>
        </Editor>
      ) as unknown as Slate

      const expected = (
        <Editor>
          <Paragraph>
            <Text>lorem ipsum</Text>
          </Paragraph>
          <Paragraph>
            <Text>dolor sit</Text>
          </Paragraph>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeOrphanNestedList', () => {
    it('should move the nested list when it does not have sibling list-item-text', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <UnorderedList>
                <ListItem>
                  <ListItemText>
                    <Text>lorem ipsum</Text>
                  </ListItemText>
                </ListItem>
              </UnorderedList>
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

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it("should move items from nested list to previous list-item's nested list when it does not have sibling list-item-text", () => {
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
                    <Text>aaa</Text>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Text>bbb</Text>
                  </ListItemText>
                </ListItem>
              </UnorderedList>
            </ListItem>
            <ListItem>
              <OrderedList>
                <ListItem>
                  <ListItemText>
                    <Text>lorem ipsum</Text>
                  </ListItemText>
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
              <UnorderedList>
                <ListItem>
                  <ListItemText>
                    <Text>aaa</Text>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Text>bbb</Text>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Text>lorem ipsum</Text>
                  </ListItemText>
                </ListItem>
              </UnorderedList>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should move nested list to previous list item when it does not have sibling list-item-text', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem ipsum</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <OrderedList>
                <ListItem>
                  <ListItemText>
                    <Text>lorem ipsum</Text>
                  </ListItemText>
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
              </OrderedList>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  describe('normalizeSiblingLists', () => {
    it('should merge sibling lists of same type', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <Paragraph>
            <Text>lorem</Text>
          </Paragraph>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>ipsum</Text>
              </ListItemText>
            </ListItem>
          </UnorderedList>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text />
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      const expected = (
        <Editor>
          <Paragraph>
            <Text>lorem</Text>
          </Paragraph>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>ipsum</Text>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemText>
                <Text />
              </ListItemText>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })

    it('should merge sibling lists of different types when they are nested lists', () => {
      const editor = (
        <Editor normalizeNode={normalizeNode}>
          <UnorderedList>
            <ListItem>
              <ListItemText>
                <Text>lorem</Text>
              </ListItemText>
              <OrderedList>
                <ListItem>
                  <ListItemText>
                    <Text>ipsum</Text>
                  </ListItemText>
                </ListItem>
              </OrderedList>
              <UnorderedList>
                <ListItem>
                  <ListItemText>
                    <Text>dolor</Text>
                  </ListItemText>
                </ListItem>
              </UnorderedList>
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
              <OrderedList>
                <ListItem>
                  <ListItemText>
                    <Text>ipsum</Text>
                  </ListItemText>
                </ListItem>
                <ListItem>
                  <ListItemText>
                    <Text>dolor</Text>
                  </ListItemText>
                </ListItem>
              </OrderedList>
            </ListItem>
          </UnorderedList>
        </Editor>
      ) as unknown as Slate

      Slate.normalize(editor, { force: true })

      expect(editor.children).toEqual(expected.children)
    })
  })

  /**
   * @see CARE-1320
   */
  it('should correctly handle list-items with zero children', () => {
    const editor = (
      <Editor normalizeNode={normalizeNode}>
        <UnorderedList>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <ListItem></ListItem>
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <ListItem></ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    const expected = (
      <Editor>
        <UnorderedList>
          <ListItem>
            <ListItemText>
              <Text></Text>
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemText>
              <Text></Text>
            </ListItemText>
          </ListItem>
        </UnorderedList>
      </Editor>
    ) as unknown as Slate

    Slate.normalize(editor, { force: true })

    expect(editor.children).toEqual(expected.children)
  })
})
