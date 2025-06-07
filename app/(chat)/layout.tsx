import { cookies } from 'next/headers';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth } from '../(auth)/auth';
import Script from 'next/script';
import packageJson from '../../package.json';
export const experimental_ppr = true;

let version = process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA?.slice(0, 7);
if (!version) {
  if (process.env.NODE_ENV === 'production') {
    version = 'prod';
  } else {
    version = 'dev';
  }
}

const year = new Date().getFullYear();

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={session?.user} />
        <SidebarInset>{children}</SidebarInset>
        <div className="text-xs text-gray-300 font-bold dark:text-gray-700 absolute bottom-0 right-0 text-right px-2">
          up/eighty © {year} | v{packageJson.version} - {version}
        </div>
      </SidebarProvider>
    </>
  );
}
