'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import AccessTokenUtils from '@/lib/accessTokenUtils'
import { extractErrorMessage } from '@/lib/extractErrorMessage'
import { trpc } from '@/lib/trpc'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { z } from 'zod'
import AccessTokenShowDialog from './AccessTokenShowDialog'

interface Props {
  refetch: () => any
}

const FormSchema = z.object({
  alias: z.string().min(2, {
    message: 'Alias must be at least 2 characters long.',
  }),
  expiredAt: z.union([z.date(), z.undefined()]).optional(),
})

export default function AccessTokenCreateForm({ refetch }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [generatedToken, setGeneratedToken] = useState('')

  const { mutateAsync } = trpc.accessToken.create.useMutation()

  const now = new Date()
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      alias: '',
      expiredAt: new Date(now.setDate(now.getDate() + 7)),
    },
  })
  const expiredAtValue = form.watch('expiredAt')

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    let plainToken = AccessTokenUtils.generateToken()
    let tokenAfterHash = AccessTokenUtils.hashToken(plainToken)
    try {
      await mutateAsync({ ...data, token: tokenAfterHash })
      refetch()
      toast.success('Access token created successfully.')
      setGeneratedToken(plainToken) // Set the generated token
      setIsDialogOpen(true)
    } catch (error) {
      const msg = extractErrorMessage(error)
      toast.error(msg)
    }
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Create a New Access Token</CardTitle>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="alias"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Token Alias</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter token alias" {...field} />
                    </FormControl>
                    <FormDescription>
                      This helps to identify and differentiate your tokens.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expiredAt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Usage Period</FormLabel>
                    <Select
                      defaultValue="1w"
                      onValueChange={(value) => {
                        const now = new Date()
                        let expirationDate

                        if (value === '1w') {
                          expirationDate = new Date(
                            now.setDate(now.getDate() + 7),
                          )
                        } else if (value === '1m') {
                          expirationDate = new Date(
                            now.setMonth(now.getMonth() + 1),
                          )
                        } else if (value === '1y') {
                          expirationDate = new Date(
                            now.setFullYear(now.getFullYear() + 1),
                          )
                        } else {
                          expirationDate = undefined
                        }

                        if (value === 'no-expiry') {
                          form.setValue('expiredAt', undefined)
                        } else {
                          form.setValue('expiredAt', expirationDate)
                        }

                        field.onChange(expirationDate)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select usage period" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1w">One Week</SelectItem>
                        <SelectItem value="1m">One Month</SelectItem>
                        <SelectItem value="1y">One Year</SelectItem>
                        <SelectItem value="no-expiry">No Expiry</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {expiredAtValue === undefined
                        ? 'Token has no expiry date.'
                        : `Token will expire on ${expiredAtValue.toLocaleDateString()}.`}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AccessTokenShowDialog
        accessToken={generatedToken}
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </div>
  )
}
