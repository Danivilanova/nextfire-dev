import Image from "next/image";
import Link from "next/link";
import { useContext } from "react";
import { UserContext } from "../lib/context";

export default function Navbar() {
  const { user, username } = useContext(UserContext);

  return (
    <nav className="h-20 w-full bg-white fixed top-0 px-10 border-b z-50">
      <ul className="max-w-7xl mx-auto w-full h-full flex flex-row items-center justify-between gap-4">
        <li>
          <Link href="/">
            <button className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              FEED
            </button>
          </Link>
        </li>
        {username && (
          <>
            <li className="ml-auto">
              <Link href="/admin">
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none ">
                  Write Posts
                </button>
              </Link>
            </li>
            <li>
              <Link href={`/${username}`}>
                <Image
                  // loader={myLoader}
                  className="rounded-full cursor-pointer"
                  width={50}
                  height={50}
                  src={user?.photoURL}
                  alt="Avatar"
                />
              </Link>
            </li>
          </>
        )}

        {!username && (
          <>
            <li>
              <Link href="/enter">
                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                  Log in
                </button>
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
