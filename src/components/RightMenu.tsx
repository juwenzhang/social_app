import React from'react';

interface RightMenuProps{
  children?: React.ReactNode;
}

const RightMenu: React.FC<RightMenuProps>
= (props: RightMenuProps) => {
  const {children} = props;
  return(
    <React.Fragment>
      <div>
        RightMenu
        {children}
      </div>
    </React.Fragment>
  );
}

export default RightMenu;