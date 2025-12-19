import { Providers } from './providers';

export const metadata = {
  title: 'Admin Dashboard',
  description: 'Admin dashboard with users and products management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
