import React from "react";
import Link from "next/link";
import Image from "next/image";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="root-layout">
      <nav>
        <Link href="/" className="flex items-center space-x-2 mb-4">
          <Image src="./logo.svg" alt="Logo" width={38} height={32} />
          <h2 className="text-primary-100">InterPrep</h2>
        </Link>
      </nav>
      {children}
    </div>
  );
};
export default RootLayout;
