'use client'

import React from 'react'
import { ITitleElement } from '@/components/editor/plugins/title-plugin'
import { NodeType, ObjectType } from '@/lib/model'
import { cn, withRef } from '@udecode/cn'
import { PlateElementProps } from '@udecode/plate-common/react'
import { Transforms } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { CommonTitle } from './CommonTitle'
import { CoverUpload } from './CoverUpload'
import { DailyTitle } from './DailyTitle'
import { ImageObject } from './ImageObject'

export const TitleElement = withRef(
  (props: PlateElementProps<ITitleElement>, ref) => {
    const element = props.element as ITitleElement
    const objectType = element.props?.objectType || ObjectType.ARTICLE
    const isDaily = element.nodeType === NodeType.DAILY
    const isDatabase = element.nodeType === NodeType.DATABASE
    const isDailyRoot = element.nodeType === NodeType.DAILY_ROOT
    const editor = useSlate()

    // console.log('======element:', element)

    function setObjectType(type: any) {
      const path = ReactEditor.findPath(editor as any, element)
      Transforms.setNodes(
        editor,
        {
          props: { ...element?.props, objectType: type },
        } as ITitleElement,
        { at: path },
      )
    }

    return (
      <div
        {...props.attributes}
        className={cn(
          'text-foreground/80 relative mb-4 flex flex-col gap-0 pr-2 text-4xl font-bold',
          isDatabase && 'pl-9',
          isDailyRoot && 'pl-4',
        )}
      >
        {isDaily && <DailyTitle {...props} />}

        {objectType === ObjectType.ARTICLE && !isDaily && (
          <>
            <CoverUpload {...props} />
            <CommonTitle {...props} />
          </>
        )}

        {!isDaily && (
          <div
            contentEditable={false}
            className="flex items-center gap-2 text-xs font-normal mt-2 text-foreground/40"
          >
            <div
              className={getObjectItemClassName(
                objectType == ObjectType.ARTICLE,
              )}
              onClick={() => setObjectType(ObjectType.ARTICLE)}
            >
              Article
            </div>
            <div
              className={getObjectItemClassName(objectType == ObjectType.NOTE)}
              onClick={() => setObjectType(ObjectType.NOTE)}
            >
              Note
            </div>
            <div
              className={getObjectItemClassName(objectType == ObjectType.IMAGE)}
              onClick={() => setObjectType(ObjectType.IMAGE)}
            >
              Image
            </div>
            <div
              className={cn(
                'disabled:',
                getObjectItemClassName(objectType == ObjectType.VIDEO),
              )}
              onClick={() => setObjectType(ObjectType.VIDEO)}
            >
              Video
            </div>
          </div>
        )}

        {objectType === ObjectType.IMAGE && (
          <>
            <ImageObject {...props} />
          </>
        )}
      </div>
    )
  },
)

function getObjectItemClassName(isActive: boolean) {
  return cn(
    'text-foreground/40 cursor-pointer font-normal',
    isActive && 'text-foreground/80 font-medium',
  )
}
