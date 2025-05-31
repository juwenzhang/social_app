import React from "react";

interface LeftMenuProps {
  children?: React.ReactNode;
}

const LeftMenu: React.FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div>
        LeftMenu
        {children}
      </div>
    </React.Fragment>
  )
}

export default LeftMenu;