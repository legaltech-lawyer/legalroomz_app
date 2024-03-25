import { OrganizationSwitcher, UserButton } from '@clerk/nextjs'

export function Header() {
  return (
    <div className="border-b p-4 bg-gray-50">
      <div className="container mx-auto flex justify-between items-center">
        <div>LegalRoomz</div>
        <div className="flex gap-2">
          <OrganizationSwitcher />
          <UserButton />
        </div>
      </div>
    </div>
  )
}
