'use client'

import { ModeToggle } from '@/components/mode-toggle'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import { SignInButton, SignOutButton, auth } from '@clerk/nextjs'
import { useMutation, useQuery } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/nextjs'

export default function Home() {
  const organization = useOrganization()
  const user = useUser()
  let orgId: string | undefined

  if (organization.isLoaded && user.isLoaded) {
    orgId = organization.organization?.id ?? user.user?.id
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : 'skip')

  const createFile = useMutation(api.files.createFile)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <ModeToggle />
      <SignedIn>
        {files?.map((file) => {
          return <div key={file._id}>{file.name}</div>
        })}
        <Button
          onClick={() => {
            if (!orgId) {
              return
            }
            createFile({
              name: 'test',
              orgId,
            })
          }}
        >
          Add name
        </Button>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <SignInButton />
      </SignedOut>
    </main>
  )
}
