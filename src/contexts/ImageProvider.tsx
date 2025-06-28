import { ImageKitProvider } from '@imagekit/next';

export default function ImageKitProviderSelf(
  { children }: 
  { children: React.ReactNode }
) {
  return (
    <ImageKitProvider urlEndpoint="https://ik.imagekit.io/nwy7eieqz/social_app/">
      {children}
    </ImageKitProvider>
  )
}