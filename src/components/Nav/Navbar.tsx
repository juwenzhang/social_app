"use client";
import React, { useState, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';
import Image from 'next/image';
import { WEBSITE_TITLE, WEBSITE_LIGHT_THEME } from '@/constants/globals';
import { ClerkLoaded, ClerkLoading } from '@clerk/nextjs';
import linkDatas from '@/components/configs/Navbar';
import MobileMenu from "@/components/Nav/MobileMenu";
import PcMenu from '@/components/Nav/PcMenu';
import Navbarlink from "@/components/Nav/Navbarlink";

interface NavbarProps{
  children?: React.ReactNode;
}

const Navbar:React.FC<NavbarProps> 
= (props: NavbarProps) => {
  const {children} = props;
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 96) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return(
    <React.Fragment>
      <div
        className={twMerge(
          `w-full px-4 md:px-8 bg-white/50
          lg:px-16 xl:px-32 2xl:px-64 scroll:scrollbar-thin 
          scroll:scrollbar-track-gray-200 
          scroll:scrollbar-thumb-gray-400 
          shadow-md shadow-gray-200`,
          isScrolled ? 
          `fixed top-0 z-50 h-20` : '',
          'transition-all duration-300 ease-in'
        )}>
        <div 
          className={twMerge(
            'h-24 flex justify-between items-center',
          )}>
          {/* left part */}
          <div className='hidden md:block w-[20%]'>
            <Link href='/' className={twMerge(
              "font-semibold text-xl gradient-text", 
              WEBSITE_LIGHT_THEME.WEBSITE_NAVBAR_COLOR)
            }>
              { WEBSITE_TITLE }
            </Link>
          </div>
          
          {/* center part */}
          <div className='md:flex w-[50%] text-sm items-center justify-between'>
            <div className='flex flex-row gap-10'>
              {/* other link */}
              {linkDatas.map(item => {
                return (
                  <Navbarlink key={item.id} {...item} />
                )
              })}
              {/* input link choice */}
              <div className='hidden lg:flex items-center justify-center 
                bg-slate-100 px-2 py-1 rounded-md'>
                <input 
                  type="text"
                  placeholder="Search……"
                  className={twMerge(
                    `bg-transparent outlint-none px-2 py-1 
                      placeholder:text-gray-400 text-sm font-semibold
                      border-none focus:ring-0 focus:border-none
                      focus:outline-none focus:ring-0 focus:border-none
                    `,
                    WEBSITE_LIGHT_THEME.WEBSITE_NAVBAR_COLOR,
                  )} 
                />
                <Image 
                  width={20} 
                  height={20} 
                  src="/images/search.png" 
                  alt="Search"
                  loading='lazy'
                  onClick={() => {
                    console.log("search")
                  }}
                />
              </div>
            </div>
          </div>

          {/* right part */}
          <div className='w-[30%] flex items-center gap-4 xl:gap-8 justify-end'>
            <ClerkLoading>
              <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid 
                  border-current border-e-transparent align-[-0.125em] text-surface 
                  motion-reduce:animate-[spin_1.5s_linear_infinite] dark:text-white"
                role="status">
                <span
                  className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap 
                    !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                  >Loading...</span
                >
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <PcMenu />
            </ClerkLoaded>
            <MobileMenu />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navbar;