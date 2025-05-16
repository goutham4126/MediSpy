"use client";
import { usePathname } from "next/navigation";

function Page() {
  const pathname = usePathname();
  const id = pathname.split("/").pop();

  return( 
    <div>
      {id}
    </div>
);
}

export default Page;
