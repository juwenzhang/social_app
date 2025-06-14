"use client"
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { twMerge } from 'tailwind-merge';

interface NavbarlinkProps{
  children?: React.ReactNode;
  href: string;
  className?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageSrc: string;
  imageAlt?: string;
  textColor?: string;
  content?: string;
}

const Navbarlink:React.FC<NavbarlinkProps>
= (props: NavbarlinkProps) => {
  const {
    children, 
    href, 
    className, 
    imageWidth = 20, 
    imageHeight = 20, 
    imageSrc, 
    imageAlt = "Image", 
    textColor = "gradient-text", 
    content = "Content"
  } = props;

  return (
    <React.Fragment>
      <Link
        href={href}
        className={twMerge(
          "text-blue-700 flex items-center gap-2 font-semibold",
          textColor,
          className || ""
        )}
      >
        <Image 
          width={imageWidth} 
          height={imageHeight} 
          src={imageSrc} 
          alt={imageAlt}
          loading='lazy'
        />
        <span>{content || ""}</span>
        {children}
      </Link>
    </React.Fragment>
  )
}

export default Navbarlink;