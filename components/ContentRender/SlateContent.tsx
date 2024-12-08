import { Checkbox } from '@/components/ui/checkbox'
import {
  ELEMENT_FILE_CAPTION,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_HR,
  ELEMENT_IMG,
  ELEMENT_LI,
  ELEMENT_LIC,
  ELEMENT_OL,
  ELEMENT_P,
  ELEMENT_TODO,
  ELEMENT_UL,
} from '@/lib/constants'
import { cn, getUrl } from '@/lib/utils'
import { Editable } from 'slate-react'
import { Leaf } from './Leaf'

export function SlateContent() {
  return (
    <Editable
      className="mt-4"
      renderLeaf={(props) => <Leaf {...props} />}
      renderElement={({ attributes, children, element }) => {
        switch (element.type) {
          case ELEMENT_P:
            if (element.listStyleType == 'disc') {
              // console.log('=====element:', element)
              const { indent = 1 } = element
              return (
                <ul
                  className="my-[1px]"
                  style={{
                    marginLeft: indent === 1 ? 0 : `${indent}em`,
                  }}
                  {...attributes}
                >
                  <li className="[&>*]:inline-flex">{children}</li>
                </ul>
              )
            }
            return (
              <div className="mb-4" {...attributes}>
                {children}
              </div>
            )
          case ELEMENT_H1:
            return <h1 {...attributes}>{children}</h1>
          case ELEMENT_H2:
            return <h2 {...attributes}>{children}</h2>
          case ELEMENT_H3:
            return <h3 {...attributes}>{children}</h3>
          case ELEMENT_H4:
            return <h4 {...attributes}>{children}</h4>
          case ELEMENT_H5:
            return <h5 {...attributes}>{children}</h5>
          case ELEMENT_H6:
            return <h6 {...attributes}>{children}</h6>
          case ELEMENT_HR:
            return <hr {...attributes}></hr>
          case ELEMENT_UL:
            return <ul {...attributes}>{children}</ul>
          case ELEMENT_OL:
            return <ol {...attributes}>{children}</ol>
          case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
          case ELEMENT_LI:
            return <>{children}</>
          case ELEMENT_LIC:
            return <li {...attributes}>{children}</li>
          case ELEMENT_TODO:
            const checked = (element as any).checked
            return (
              <div
                className="flex items-center flex-1 leading-normal py1 gap-1"
                {...attributes}
              >
                <Checkbox contentEditable={false} checked={checked || false} />
                <div
                  className={cn(
                    'relative flex-1',
                    checked && 'line-through opacity-60',
                  )}
                >
                  {children}
                </div>
              </div>
            )
          case ELEMENT_IMG:
            return (
              <img
                src={getUrl((element as any).url)}
                alt=""
                {...attributes}
              ></img>
            )
          case ELEMENT_FILE_CAPTION:
            console.log('element.url:', element)
            return null as any
          default:
            return <div {...attributes}>{children}</div>
        }
      }}
      readOnly
    />
  )
}
