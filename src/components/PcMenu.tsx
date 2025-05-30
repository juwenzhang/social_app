import React from "react";
import { 
  SignedIn, 
  SignedOut, 
  SignInButton, 
  SignUpButton, 
  UserButton 
} from '@clerk/nextjs';

interface PcMenuProps {
  children?: React.ReactNode;
}

const PcMenu: React.FC<PcMenuProps> = (props: PcMenuProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div className="bg-white p-5 hidden md:flex items-center">
        <div className="flex flex-row items-center justify-center gap-4">
          <SignedOut>
            <SignInButton />
            <SignUpButton />
          </SignedOut>
        </div>

        <div className="flex flex-row items-center justify-center gap-4">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
      {children}
    </React.Fragment>
  )
}

export default PcMenu;