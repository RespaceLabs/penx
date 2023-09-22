function wrapInFragment(nodes: (string | Node)[]): DocumentFragment {
  const fragment = document.createDocumentFragment()
  fragment.append(...nodes)
  return fragment
}

function wrapInList(
  nodes: (string | Node)[],
  nodeName: 'OL' | 'UL',
): HTMLElement {
  const listElement = document.createElement(nodeName)
  listElement.append(...nodes)
  return listElement
}

function wrapInLi(nodes: (string | Node)[]): HTMLElement {
  const listItemElement = document.createElement('li')
  listItemElement.append(...nodes)
  return listItemElement
}

/**
 * Activates `Range.prototype.cloneContents` override that ensures in the cloned contents:
 * - there are no <li> children elements without parent <li> element
 * - there are no <li> elements without parent <ol> or <ul> elements
 */
export function patchRangeCloneContents() {
  const originalCloneContents = Range.prototype.cloneContents

  Range.prototype.cloneContents = function cloneContents(): DocumentFragment {
    const contents = originalCloneContents.apply(this)

    if (
      this.commonAncestorContainer.nodeName === 'OL' ||
      this.commonAncestorContainer.nodeName === 'UL'
    ) {
      return wrapInFragment([
        wrapInList(
          [...contents.childNodes],
          this.commonAncestorContainer.nodeName,
        ),
      ])
    }

    if (
      this.commonAncestorContainer.nodeName === 'LI' &&
      this.commonAncestorContainer.parentElement &&
      (this.commonAncestorContainer.parentElement.nodeName === 'OL' ||
        this.commonAncestorContainer.parentElement.nodeName === 'UL')
    ) {
      return wrapInFragment([
        wrapInList(
          [wrapInLi([...contents.childNodes])],
          this.commonAncestorContainer.parentElement.nodeName,
        ),
      ])
    }

    return contents
  }

  /**
   * Brings back the original `Range.prototype.cloneContents`.
   */
  return function undo() {
    Range.prototype.cloneContents = originalCloneContents
  }
}
