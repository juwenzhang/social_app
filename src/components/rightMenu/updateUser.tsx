"use client";
import { useRouter } from 'next/navigation';
import React, { useRef, useState } from 'react';

interface UpdateUserType {
  user: any,
  type: string
}

const UpdateUser: React.FC<UpdateUserType> = (props: UpdateUserType) => {
  const { user, type } = props;
  const router = useRouter();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<any>({
    username: user.username,
    email: user.email,
    password: '',
    confirmPassword: '',
    enterprise: user.enterprise,
    description: user.description,
    github_name: user.github_name,
    juejin_name: user.juejin_name,
    juejin_link: user.juejin_link,
  });

  const leftContainerRef = useRef<HTMLDivElement>(null);

  const handleClick = async () => {
    setIsOpen(false);
    if (type === 'home') {
      router.push(`/`);
    } else if (type === 'admin') {
      router.push(`/profile/${user.id}`);
    }
  }
  return (
    <React.Fragment>
      <div
        className="text-sm gradient-text font-semibold cursor-pointer"
        onClick={() => {
          setIsOpen(true);
        }}
      >
        UpdateUser
      </div>
      {
        isOpen && (
          <div className='fixed bg-black/50 w-screen h-screen top-0 left-0 
            flex flex-col items-center justify-center gap-2'
            onClick={() => {
              setIsOpen(false);
            }}>
            <div 
              className='
                flex items-center justify-center gap-2
              '>
              <div 
                className='bg-white/50 w-[500px] rounded-md p-4 
                  flex items-center justify-around flex-col gap-3 h-[800px]'
                onClick={(e) => {
                  e.stopPropagation();
                }}
                ref={leftContainerRef}>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Username</label>
                  <input type="text" value={currentUser.username} placeholder={user.username}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        username: e.target.value,
                      });
                    }}
                  />  
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Email</label>
                  <input type="text" value={currentUser.email} placeholder={user.email}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        email: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Password</label>
                  <input type="password" placeholder='password' value={currentUser.password} 
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        password: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Confirm Password</label>
                  <input type="password" placeholder='confirm password' value={currentUser.confirmPassword}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        confirmPassword: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Enterprise</label>
                  <input type="text" value={currentUser.enterprise} placeholder={user.enterprise}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        enterprise: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Description</label>
                  <input type="text" value={currentUser.description} placeholder={user.description}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        description: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Github Name</label>
                  <input type="text" value={currentUser.github_name} placeholder={user.github_name}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        github_name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Juejin Name</label>
                  <input type="text" value={currentUser.juejin_name} placeholder={user.juejin_name}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        juejin_name: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className='flex flex-col items-center justify-center gap-2 w-[400px]'>
                  <label className='text-lg font-semibold'>Juejin Link</label>
                  <input type="text" value={currentUser.juejin_link} placeholder={user.juejin_link}
                    className='
                      w-[400px] h-[40px] rounded-md p-2
                      bg-black/50 text-white
                    '
                    onChange={(e) => {
                      setCurrentUser({
                        ...currentUser,
                        juejin_link: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div
                className='bg-white/50 w-[500px] rounded-md p-4 
                  flex items-center justify-center flex-col gap-3'
                style={{
                  // height: `${leftContainerRef && leftContainerRef.current?.clientHeight}px`
                  height: '800px'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                }}>
              </div>
            </div>
            <div 
              className='flex flex-col items-center justify-center gap-2 w-[800px]'
              onClick={handleClick}>
              <button className='
                w-[800px] h-[40px] rounded-md p-2
                bg-black/50 text-white hover:bg-black hover:cursor-pointer
              '>
                Update
              </button>
            </div>
          </div>
        )
      }
    </React.Fragment>
  );
}

export default UpdateUser;