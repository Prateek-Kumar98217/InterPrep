import Image from "next/image";
import Link from "next/link";
import React from "react";

const RootLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <>
      <div className="root-layout">
        <nav>
          <Link href="/" className="flex items-start gap-2">
            <Image src="/logo.svg" alt="Logo" width={38} height={32}></Image>
            <h2 className="text-primary-100">InterPrep</h2>
          </Link>
        </nav>
      </div>
      <div>{children}</div>
    </>
  );
};

export default RootLayout;
