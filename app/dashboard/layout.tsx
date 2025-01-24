// import { ReactNode } from "react";
// import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
// import { Button } from "@/components/ui/button";
// import { CircleUser, MenuIcon } from "lucide-react";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { redirect } from "next/navigation";
// import { unstable_noStore as noStore } from "next/cache";
// import { DashboardNavigation } from "@/components/dashboard/DasboardNavigation";

// export default async function DashboardLayout({
//   children,
// }: {
//   children: ReactNode;
// }) {
//   noStore();
//   // const { getUser } = getKindeServerSession();
//   // const user = await getUser();

//   // if (!user || user.email !== "jan@alenix.de") {
//   //   return redirect("/");
//   // }
//   return (
//     // <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//     //   <header className="sticky z-10 top-0 flex h-16 items-center justify-between gap-4 border-b bg-white">
//     //     <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//     //       <DashboardNavigation />
//     //     </nav>

//     //     <Sheet>
//     //       <SheetTrigger asChild>
//     //         <Button
//     //           className="shrink-0 md:hidden"
//     //           variant="outline"
//     //           size="icon"
//     //         >
//     //           <MenuIcon className="h-5 w-5" />
//     //         </Button>
//     //       </SheetTrigger>
//     //       <SheetContent side="left">
//     //         <nav className="flex flex-col gap-6 text-lg font-medium mt-5">
//     //           <DashboardNavigation />
//     //         </nav>
//     //       </SheetContent>
//     //     </Sheet>

//     //     <DropdownMenu>
//     //       <DropdownMenuTrigger asChild>
//     //         <Button variant="secondary" size="icon" className="rounded-full">
//     //           <CircleUser className="w-5 h-5" />
//     //         </Button>
//     //       </DropdownMenuTrigger>
//     //       <DropdownMenuContent align="end">
//     //         <DropdownMenuLabel>My Account</DropdownMenuLabel>
//     //         <DropdownMenuSeparator />
//     //         <DropdownMenuItem asChild>
//     //           {/* <LogoutLink>Logout</LogoutLink> */}
//     //         </DropdownMenuItem>
//     //       </DropdownMenuContent>
//     //     </DropdownMenu>
//     //   </header>
//     //   <main className="my-5">{children}</main>
//     // </div>

//     <div className="flex w-full flex-col">
//       <header className="sticky z-10 top-0 flex h-16 items-center justify-between gap-4 border-b bg-white w-full">
//         <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
//           <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
//             <DashboardNavigation />
//           </nav>

//           <Sheet>
//             <SheetTrigger asChild>
//               <Button
//                 className="shrink-0 md:hidden"
//                 variant="outline"
//                 size="icon"
//               >
//                 <MenuIcon className="h-5 w-5" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="left">
//               <nav className="flex flex-col gap-6 text-lg font-medium mt-5">
//                 <DashboardNavigation />
//               </nav>
//             </SheetContent>
//           </Sheet>

//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="secondary" size="icon" className="rounded-full">
//                 <CircleUser className="w-5 h-5" />
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuLabel>My Account</DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem asChild>
//                 {/* <LogoutLink>Logout</LogoutLink> */}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </header>
//       <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 my-5">
//         {children}
//       </main>
//     </div>
//   );
// }
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <Toaster />
        {/* page main content */}
        {children}
        {/* page main content ends */}
      </SidebarInset>
    </SidebarProvider>
  );
}
