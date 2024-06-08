import React from 'react'
import { StoreContext } from './StoreProvider'

const Profile = () => {
    const { state } = React.useContext(StoreContext)
  return (
    <div className='h-screen bg-light-primary flex items-center justify-center'>
        <div className='relative bg-primary border-white  border-4 rounded-2xl w-2/3 h-48 pt-24 text-center'>
            {/* Photo by <a href="https://unsplash.com/@michaeldam?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Michael Dam</a> on <a href="https://unsplash.com/photos/closeup-photography-of-woman-smiling-mEZ3PoFGs_k?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash">Unsplash</a>
   */}
            <img className="bg-primary rounded-full h-[150px] w-[150px] border-4 object-cover object-top border-white absolute left-1/2 -translate-x-1/2 top-0 -translate-y-1/2" src="/assets/profile.jpg" alt="profile" />
            <div className='text-2xl text-white'>{`${state.f_name} ${state.l_name}`}</div>
            <div  className='text-2xl text-white'>{state.email}</div>
        </div>
    </div>
  )
}

export default Profile