import { count } from 'console'
import { arrayMoveImmutable } from 'array-move'
import { desc, eq, or, sql } from 'drizzle-orm'
import { z } from 'zod'
import { getRandomColorName } from '@/lib/color-helper'
import { FieldType, Option, ViewField, ViewType } from '@/lib/types'
import { uniqueId } from '@/lib/unique-id'
import { db } from '../db'
import { databases, fields, posts, records, views } from '../db/schema'
import { protectedProcedure, publicProcedure, router } from '../trpc'

export const databaseRouter = router({
  list: protectedProcedure.query(async ({ ctx, input }) => {
    return await db.query.databases.findMany({
      orderBy: [desc(databases.updatedAt), desc(databases.createdAt)],
    })
  }),

  byId: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const database = await db.query.databases.findFirst({
      with: {
        views: true,
        fields: true,
        records: true,
      },
      where: eq(databases.id, input),
    })

    return database!
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [newDatabase] = await db
        .insert(databases)
        .values({
          userId: ctx.token.uid,
          color: getRandomColorName(),
          ...input,
        })
        .returning()

      const newFields = await db
        .insert(fields)
        .values([
          {
            databaseId: newDatabase.id,
            fieldType: FieldType.TEXT,
            name: uniqueId(),
            displayName: 'Title',
            isPrimary: true,
            config: {},
            options: [],
          },
          {
            databaseId: newDatabase.id,
            fieldType: FieldType.SINGLE_SELECT,
            name: uniqueId(),
            displayName: 'Tag',
            config: {},
            options: [],
          },
        ])
        .returning()

      const viewFields: ViewField[] = newFields.map((field) => ({
        fieldId: field.id,
        width: 160,
        visible: true,
      }))

      const [tableView, listView] = await db
        .insert(views)
        .values([
          {
            databaseId: newDatabase.id,
            name: 'Table',
            viewType: ViewType.TABLE,
            viewFields,
            sorts: [],
            filters: [],
            groups: [],
            kanbanFieldId: '',
            kanbanOptionIds: [],
          },
          {
            databaseId: newDatabase.id,
            name: 'Gallery',
            viewType: ViewType.GALLERY,
            viewFields,
            sorts: [],
            filters: [],
            groups: [],
            kanbanFieldId: '',
            kanbanOptionIds: [],
          },
        ])
        .returning()

      await db
        .update(databases)
        .set({
          activeViewId: tableView.id,
          viewIds: [tableView.id, listView.id],
        })
        .where(eq(databases.id, newDatabase.id))

      const recordFields = newFields.reduce(
        (acc, field) => {
          return {
            ...acc,
            [field.id]: '',
          }
        },
        {} as Record<string, any>,
      )

      await db.insert(records).values([
        {
          databaseId: newDatabase.id,
          sort: 0,
          fields: recordFields,
        },
        {
          databaseId: newDatabase.id,
          sort: 1,
          fields: recordFields,
        },
      ])
      return newDatabase
    }),

  addRecord: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        databaseId: z.string(),
        fields: z.record(z.unknown()),
        sort: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db.insert(records).values(input)
      return true
    }),

  addRefBlockRecord: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        refBlockId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const fieldList = await db.query.fields.findMany({
        where: eq(fields.databaseId, input.databaseId),
      })

      const res = await db
        .select({ count: sql<number>`count(*)` })
        .from(records)
        .where(eq(records.databaseId, input.databaseId))
      const count = res[0].count

      const newFields = fieldList.reduce(
        (acc, field) => {
          return {
            ...acc,
            [field.id]: field.isPrimary
              ? { refType: 'BLOCK', id: input.refBlockId }
              : '',
          }
        },
        {} as Record<string, any>,
      )

      const [record] = await db
        .insert(records)
        .values({
          databaseId: input.databaseId,
          sort: count + 1,
          fields: newFields,
        })
        .returning()

      return record
    }),

  addField: protectedProcedure
    .input(
      z.object({
        id: z.string().optional(),
        databaseId: z.string(),
        fieldType: z.string(),
        name: z.string(),
        displayName: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [field] = await db.insert(fields).values(input).returning()

      const viewList = await db.query.views.findMany({
        where: eq(views.databaseId, input.databaseId),
      })

      for (const view of viewList) {
        await db
          .update(views)
          .set({
            viewFields: [
              ...(view.viewFields as any),
              {
                fieldId: field.id,
                width: 160,
                visible: true,
              },
            ],
          })
          .where(eq(views.id, view.id))
      }

      const recordList = await db.query.records.findMany({
        where: eq(views.databaseId, input.databaseId),
      })

      for (const record of recordList) {
        await db
          .update(records)
          .set({
            fields: {
              ...(record.fields as any),
              [field.id]: '',
            },
          })
          .where(eq(records.id, record.id))
      }

      return true
    }),

  updateField: protectedProcedure
    .input(
      z.object({
        fieldId: z.string(),
        displayName: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { fieldId, ...rest } = input
      await db.update(fields).set(rest).where(eq(fields.id, fieldId))
      return true
    }),

  sortViewFields: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        fromIndex: z.number(),
        toIndex: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await db.query.views.findFirst({
        where: eq(views.id, input.viewId),
      })
      await db
        .update(views)
        .set({
          viewFields: arrayMoveImmutable(
            view?.viewFields as ViewField[],
            input.fromIndex,
            input.toIndex,
          ),
        })
        .where(eq(views.id, input.viewId))
      return true
    }),

  updateRecord: protectedProcedure
    .input(
      z.object({
        recordId: z.string(),
        fields: z.record(z.unknown()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await db
        .update(records)
        .set({ fields: input.fields })
        .where(eq(records.id, input.recordId))
      return true
    }),

  deleteField: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        fieldId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [viewList, recordList] = await Promise.all([
        db.query.views.findMany({
          where: eq(views.databaseId, input.databaseId),
        }),
        db.query.records.findMany({
          where: eq(views.databaseId, input.databaseId),
        }),
        db.delete(fields).where(eq(fields.id, input.fieldId)),
      ])

      for (const view of viewList) {
        const viewFields = view.viewFields as ViewField[]
        await db
          .update(views)
          .set({
            viewFields: viewFields.filter((i) => i.fieldId !== input.fieldId),
          })
          .where(eq(views.id, view.id))
      }

      for (const record of recordList) {
        const fields = record.fields as Record<string, any>
        delete fields[input.fieldId]
        await db
          .update(records)
          .set({ fields })
          .where(eq(records.id, record.id))
      }

      return true
    }),

  deleteRecord: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await db.delete(records).where(eq(records.id, input))
      return true
    }),

  updateViewField: protectedProcedure
    .input(
      z.object({
        viewId: z.string(),
        fieldId: z.string(),
        width: z.number().optional(),
        visible: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const view = await db.query.views.findFirst({
        where: eq(views.id, input.viewId),
      })

      const viewFields = view!.viewFields as ViewField[]

      for (const viewField of viewFields) {
        if (viewField.fieldId === input.fieldId) {
          if (input.width) viewField.width = input.width
          if (typeof input.visible === 'boolean') {
            viewField.visible = input.visible
          }
        }
      }

      await db
        .update(views)
        .set({ viewFields })
        .where(eq(views.id, input.viewId))
      return true
    }),

  addOption: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        fieldId: z.string(),
        name: z.string(),
        color: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const field = await db.query.fields.findFirst({
        where: eq(fields.id, input.fieldId),
      })

      const options = (field?.options as Option[]) || []

      await db
        .update(fields)
        .set({
          options: [...options, input],
        })
        .where(eq(fields.id, input.fieldId))
      return true
    }),

  deleteDatabase: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      await db.delete(records).where(eq(records.databaseId, input))
      await db.delete(fields).where(eq(fields.databaseId, input))
      await db.delete(views).where(eq(views.databaseId, input))
      await db.delete(databases).where(eq(databases.id, input))
      return true
    }),

  updateDatabase: protectedProcedure
    .input(
      z.object({
        databaseId: z.string(),
        name: z.string().optional(),
        color: z.string().optional(),
        cover: z.string().optional(),
        icon: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { databaseId, ...rest } = input
      await db.update(databases).set(rest).where(eq(databases.id, databaseId))
      return true
    }),
})
