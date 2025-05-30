import React from 'react';

interface ProfilePageProps{
  children?: React.ReactNode;
}

const ProfilePage:React.FC<ProfilePageProps> 
= (props: ProfilePageProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <h1>
        ProfilePage
      </h1>
      {children}
    </React.Fragment>
  );
}

export default ProfilePage;