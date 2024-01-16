import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./NavItems";
import MoblieNav from "./MoblieNav";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className=" w-full border-b">
      <div className="wrapper flex items-center justify-between">
        <Link href="/" className=" w-36">
          <Image
            src="/assets/images/logo.svg"
            alt="Evently logo"
            width={128}
            height={38}
          ></Image>
        </Link>

        {/* SignedIn是一个条件组件，里面的内容只有在用户登录后才会显示 */}
        <SignedIn>
          <nav className=" md:flex-between hidden w-full max-w-xs">
            <NavItems></NavItems>
          </nav>
        </SignedIn>

        <div className=" flex w-32 justify-end gap-3">
          <SignedIn>
            <UserButton afterSignOutUrl="/"></UserButton>
            <MoblieNav></MoblieNav>
          </SignedIn>

          <SignedOut>
            <Button asChild className="bg-primary-500 rounded-full" size="lg">
              <Link href="/sign-in">Login</Link>
            </Button>
          </SignedOut>
        </div>
      </div>
    </header>
  );
}
