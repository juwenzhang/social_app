interface MenuDataType {
  id: number;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  content: string;
  textColor: string;  
}

const linkDatas: MenuDataType[] = [
  { 
    id: 1, 
    title: "Home", 
    href: "/", 
    imageSrc: "/images/home.png", 
    imageAlt: "Home",
    content: "Home",
    textColor: "text-green-300"  
  },
  {
    id: 2,
    title: "Friends",
    href: "/friends",
    imageSrc: "/images/friends.png",
    imageAlt: "Friends",
    content: "Friends",
    textColor: "text-blue-500"
  },
  {
    id: 3,
    title: "Stories",
    href: "/stories",
    imageSrc: "/images/stories.png",
    imageAlt: "Stories",
    content: "Stories",
    textColor: "text-blue-700"
  }
];

export default linkDatas;