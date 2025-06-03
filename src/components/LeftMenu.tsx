import React from "react";
import Ad from "@/components/Ad";

interface LeftMenuProps {
  children?: React.ReactNode;
}

const LeftMenu: React.FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { children } = props;
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 rounded-md">
        <Ad size="sm" />
        {children}
      </div>
    </React.Fragment>
  )
}

export default LeftMenu;