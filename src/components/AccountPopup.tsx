import { useContext } from 'react'
import Popup from './Popup'
import { UserContext } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'

function AccountPopup({ open = null, setOpen }: { open: Boolean | null, setOpen: Function }) {
  const { user } = useContext(UserContext)

  return user && <Popup open={open} setOpen={setOpen}>
    <div>
      <div className="form-content">
        <h2 className="text-center">user account</h2>
        <div className="flex mt-4">
          <Avatar>
            <AvatarImage src={`/api/files/contact/${user.ext_Contact_GUID}`} />
            <AvatarFallback>{user.ext_First_Name[0] + user.ext_Last_Name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center mx-4">
            <p className="font-bold">{user.ext_Nickname} {user.ext_Last_Name}</p>
            <p>{user.email}</p>
            <p>{user.user_type}</p>
          </div>
          <div className="flex flex-col justify-end ml-auto">
            <Button variant="default" asChild>
              <Link href="/logout">Logout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Popup>
}

export default AccountPopup