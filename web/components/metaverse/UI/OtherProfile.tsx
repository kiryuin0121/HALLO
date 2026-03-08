import { AvatarConfig } from '@/types/avatar'
import { Profile, User } from '@/types/prisma'
import OtherProfileUI from './OtherProfileUI'
import OtherProfileScene from '../3D/OtherProfileScene'

type Props = {
  userData:{
    user:User,
    profile:Profile,
    avatarConfig:AvatarConfig
  }
}
const OtherProfile = ({userData}:Props) => {
  return (
    <section className={`relative w-screen h-screen overflow-hidden`}>
      <OtherProfileUI user={userData.user} profile={userData.profile}/>
      <OtherProfileScene avatarConfig={userData.avatarConfig}/>
    </section>
  )
}

export default OtherProfile