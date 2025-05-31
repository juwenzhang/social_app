import React from 'react';
import { SignUp } from '@clerk/nextjs';

interface SignUpPageProps{
  children?: React.ReactNode;
}

const SignUpPage: React.FC<SignUpPageProps> 
= (props: SignUpPageProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div className='flex justify-center items-center 
        min-h-[calc(100vh-96px)]'>
        <SignUp />
        {children}
      </div>
    </React.Fragment>
  );
}

export default SignUpPage;