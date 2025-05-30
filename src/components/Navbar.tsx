"use client";
import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import { WEBSITE_TITLE, WEBSITE_LIGHT_THEME } from '@/constants/globals';
import linkDatas from '@/components/configs/Navbar';
import MobileMenu from "@/components/MobileMenu";
import PcMenu from './PcMenu';
import Navbarlink from "@/components/Navbarlink";

interface NavbarProps{
  children?: React.ReactNode;
}

const Navbar:React.FC<NavbarProps> 
= (props: NavbarProps) => {
  const {children} = props;
  
  return(
    <React.Fragment>
      <div className="h-24 flex justify-between items-center">
        {/* left part */}
        <div className='hidden md:block w-[20%]'>
          <Link href='/' className={twMerge(
            "font-semibold text-xl", 
            WEBSITE_LIGHT_THEME.WEBSITE_NAVBAR_COLOR)
          }>
            { WEBSITE_TITLE }
          </Link>
        </div>
        
        {/* center part */}
        <div className='md:flex w-[50%]'>
          <div className='flex flex-row gap-6'>
            {linkDatas.map(item => {
              return (
                <Navbarlink key={item.id} {...item} />
              )
            })}
          </div>
        </div>

        {/* right part */}
        <div className='w-[30%] flex items-center gap-4 xl:gap-8 justify-end'>
          <MobileMenu />
          <PcMenu />
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navbar;