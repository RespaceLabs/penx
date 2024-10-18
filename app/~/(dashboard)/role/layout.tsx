import { ReactNode } from 'react'

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col justify-between">
        <div className="text-3xl font-bold">Role</div>
        <p className="text-sm text-muted-foreground my-1">
          Manage and assign different roles to users. Roles determine what
          actions users can perform within the application.
        </p>
      </div>
      {children}
    </div>
  )
}
