import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  SignedIn, 
  SignedOut, 
  UserButton, 
} from '@clerk/nextjs';

interface PcMenuProps {
  children?: React.ReactNode;
}

const PcMenu: React.FC<PcMenuProps> = (props: PcMenuProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div className="bg-transparent p-5 hidden md:flex items-center">
        <div className="flex flex-row items-center justify-center gap-5">
          <SignedIn>
            <div className="cursor-pointer">
              <Image src='/images/people.png' loading="lazy" 
                alt='' width={25} height={25} />
            </div>
            <div className="cursor-pointer">
              <Image src='/images/messages.png' loading="lazy" 
                alt='' width={25} height={25} />
            </div>
            <div className="cursor-pointer">
              <Image src='/images/notifications.png' loading="lazy" 
                alt='' width={25} height={25} />
            </div>
            <UserButton />
          </SignedIn>
        </div>

        <div className="flex flex-row items-center justify-center gap-4">
          <SignedOut>
            <Image 
              src='/images/login.png' alt='' width={20} height={20}
            />
            <Link href='/sign-in'>Login</Link>
            <Link href='/sign-up'>Register</Link>
          </SignedOut>
        </div>
      </div>
      {children}
    </React.Fragment>
  )
}

export default PcMenu;