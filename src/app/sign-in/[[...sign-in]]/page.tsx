import React from 'react';
import { SignIn } from '@clerk/nextjs';

interface SignInPageProps{
  children?: React.ReactNode;
}
const SignInPage: React.FC<SignInPageProps> 
= (props: SignInPageProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='flex justify-center items-center min-h-[calc(100vh-96px)]'>
        <SignIn />
        {children}
      </div>
    </React.Fragment>
  );  
}

export default SignInPage;