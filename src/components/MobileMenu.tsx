"use client"
import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import Link from "next/link";
import { WEBSITE_LIGHT_THEME } from "@/constants/globals";
import menuData from "./configs/MenuData";
import useColor from "@/utils/setColor";

interface MobileMenuProps {
  children?: React.ReactNode;
}

const MobileMenu: React.FC<MobileMenuProps> 
= (props: MobileMenuProps) => {
  const { children } = props;
  const colorFunc = useColor();
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <React.Fragment>
      <div className="md:hidden">
        {/* right mobile part */}
        <div 
          className="flex flex-col gap-[4.5] cursor-pointer"
          onClick={toggleMenu}
        >
          <div className={twMerge(
              "w-6 h-1 rounded-sm origin-left", 
              WEBSITE_LIGHT_THEME.WEBSITE_MENU_COLOR,
              isOpen ? "rotate-45" : "",
              'transition-transform duration-300 ease-in-out'
            )
          }></div>
          <div className={twMerge(
              "w-6 h-1 rounded-sm", 
              WEBSITE_LIGHT_THEME.WEBSITE_MENU_COLOR,
              isOpen? "scale-0" : "",
            )
          }></div>
          <div className={twMerge(
              "w-6 h-1 rounded-sm origin-left", 
              WEBSITE_LIGHT_THEME.WEBSITE_MENU_COLOR,
              isOpen ? "-rotate-45" : "",
              'transition-transform duration-300 ease-in-out'
            )
          }></div>
        </div>
        {isOpen && (
          <>
            <div className="
              absolute left-0 top-24 w-full h-[calc(100vh-96px)] bg-white
              flex flex-col gap-[16px] items-center justify-center font-semibold
              text-xl z-10
            ">
              {menuData.map((item) => (
                <Link key={item.id} href={item.link}>
                  <div style={
                    { color: colorFunc.getRandomHSLAColor() }
                  }>
                    {item.title}
                  </div>
                </Link>
              ))} 
            </div>
          </>
        )}
      </div>
    </React.Fragment>
  )
}

export default MobileMenu;