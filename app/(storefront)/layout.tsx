import { Footer } from "@/components/landing-page/footer";
import { Header } from "@/components/landing-page/header";
import { type ReactNode } from "react";

export default function StoreFrontLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <div className="flex flex-col min-h-screen h-screen overflow-y-scroll">
        {children}
      </div>
      <Footer />
    </>
  );
}
