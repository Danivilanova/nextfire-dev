import Link from "next/link";

export default function Custom404() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-xl font-bold">
        404 - That page does not seem to exist...
      </h1>
      <iframe
        className="my-4"
        src="https://giphy.com/embed/l2JehQ2GitHGdVG9y"
        width="480"
        height="362"
        frameBorder="0"
        allowFullScreen
      ></iframe>
      <Link href="/">
        <button className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
          Go home
        </button>
      </Link>
    </main>
  );
}
