import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className=" border-t">
      <div className=" flex-between  wrapper flex flex-col gap-4 p-5 text-center sm:flex-row">
        <Link href="/">
          <Image
            src="/assets/images/logo.svg"
            alt="logo"
            width={128}
            height={38}
          ></Image>
        </Link>
        <p>2024 Evently. All Rights reserved.</p>
      </div>
    </footer>
  );
}
