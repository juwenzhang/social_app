import React from 'react';

interface SettingsPageProps{
  children?: React.ReactNode;
}

const SettingsPage:React.FC<SettingsPageProps>
= (props: SettingsPageProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <h1>
        SettingsPage
      </h1>
      {children}
    </React.Fragment>
  );
}

export default SettingsPage;