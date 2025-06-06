import React from "react";
import Link from "next/link";
import Image from "next/image";
import Ad from "@/components/Ad";
import ProfileCard from "@/components/leftMenu/ProfileCard";
import MenuItems from "@/components/configs/MenuItems";

interface LeftMenuProps {
  children?: React.ReactNode;
  type?: "profile" | "home",
  userId?: string
}

const LeftMenu: React.FC<LeftMenuProps> = (props: LeftMenuProps) => {
  const { 
    children,
    type = "home",
    userId
  } = props;
  return (
    <React.Fragment>
      <div className="flex flex-col gap-4 rounded-md">
        {type === "home" && (<ProfileCard userId={userId} />)}
        <div className="
          p-3 bg-white/50 rounded-md shadow-md
          text-sm text-gray-500/50 flex flex-col gap-4
        ">
          {MenuItems.map(item => {
            return (
              <Link
                key={item.id}
                href={item.route}
                className={`text-sm font-semibold
                  flex items-center gap-4 items-center
                  hover:bg-gray-300 p-2 rounded-md
                `}
              >
                <Image 
                  src={item.imageUrl}
                  width={20}
                  height={20}
                  alt={item.imageDesc}
                  loading="lazy"
                  className="object-cover"
                />
                <span
                  className={`${item.textColor} font-semibold 
                    hover:${item.hoverColor}
                    transition-all duration-300 ease-in-out
                  `}
                >{item.title}</span>
              </Link>
            )
          })}
        </div>
        <Ad size="sm" />
        {children}
      </div>
    </React.Fragment>
  )
}

export default LeftMenu;