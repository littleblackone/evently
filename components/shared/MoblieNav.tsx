import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Separator } from "../ui/separator";
import NavItems from "./NavItems";

export default function MoblieNav() {
  return (
    <nav className=" md:hidden">
      <Sheet>
        <SheetTrigger className=" align-middle">
          <Image
            src="/assets/icons/menu.svg"
            alt="menu"
            width={24}
            height={24}
            className=" cursor-pointer"
          ></Image>
        </SheetTrigger>
        <SheetContent className=" flex flex-col gap-6 bg-white md:hidden">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          ></Image>
          <Separator className=" border border-gray-50"></Separator>
          <NavItems></NavItems>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
