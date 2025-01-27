import { Popup } from "@/components/popups";
import { useUser } from '@/context/UserContext';
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from 'next/link'
import { logout } from '@/lib/util';

function AccountPopup({ open = undefined, setOpen }: { open: Boolean | undefined, setOpen: Function }) {
  const { user } = useUser();

  return user && <Popup open={open} setOpen={setOpen}>
    <div className="bg-secondary">
      <div className="p-2 border-b-4 border-accent">
        <h2 className="text-center">user account</h2>
      </div>
      <div className="flex p-2">
        <Avatar>
          <AvatarImage src={`/api/client/files/contact/${user.ext_Contact_GUID}`} />
          <AvatarFallback>{user.ext_First_Name[0] + user.ext_Last_Name[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col justify-center mx-4">
          <p className="font-bold">{user.ext_Nickname} {user.ext_Last_Name}</p>
          <p>{user.email}</p>
          <p>{user.user_type}</p>
        </div>
        <div className="flex flex-col justify-end ml-auto">
          <Button variant="default" onClick={logout}>Logout</Button>
        </div>
      </div>
    </div>
  </Popup>
}

export default AccountPopup