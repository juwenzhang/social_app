import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/Nav/Navbar";
// import Background from "@/components/base/Background";
import StarBackground from "@/components/base/StarBackground";
import { ThemeProvider } from "@/contexts/provider/ThemeProvider";
import ToastContainer from '@/contexts/provider/ToastSsrProvider';
import { auth } from "@clerk/nextjs/server";
import ImageKitProviderSelf from "@/contexts/ImageProvider";
import 'react-toastify/dist/ReactToastify.css';
import "./globals.css";

export const metadata: Metadata = {
  title: "Social App",
  description: "Social app",
  icons: {
    icon: "/images/favicon.png",
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const { userId } = await auth(); 

  return (
    <ClerkProvider>
      <ThemeProvider>
        <ImageKitProviderSelf>
          <html lang="en">
            <body
              className={`
                antialiased
              `}
            >
              {/* background */}
              <div className="absolute">
                {/* <Background /> */}
                {/* <StarBackground /> */}
              </div>

              {/* navbar */}
              <Navbar userId={userId as string} />
            
              {/* main content */}
              <div
                className="
                  bg-slate-100/50 px-4
                  md:px-8 lg:px-16 xl:px-32 2xl:px-64
                  min-h-[calc(100vh-96px)] relative
                ">    
                {children}
              </div>
              {/* toast */}
              <ToastContainer  />
            </body>
          </html>
        </ImageKitProviderSelf>
      </ThemeProvider>
    </ClerkProvider>
  );
}
