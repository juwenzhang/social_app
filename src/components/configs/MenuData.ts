interface MenuItemType {
  id: number;
  title: string;
  link: string;
}

const menuData: MenuItemType[] = [
  { 
    id: 1, 
    title: "Home", 
    link: "/", 
  },
  { 
    id: 2, 
    title: "Friends", 
    link: "/friends", 
  },
  { 
    id: 3, 
    title: "Groups", 
    link: "/groups", 
  },
  { 
    id: 4, title: "Stories", 
    link: "/stories", 
  },
  {
    id: 5,
    title: "Profile",
    link: "/profile",
  },
  { 
    id: 7, 
    title: "Login", 
    link: "/sign-in", 
  },
  {
    id: 8,
    title: "Register",
    link: "/sign-up",
  }
];

export default menuData;