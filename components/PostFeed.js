import Link from "next/link";

export default function PostFeed({ posts, admin }) {
  return posts
    ? posts.map((post) => (
        <PostItem post={post} key={post.slug} admin={admin} />
      ))
    : null;
}

function PostItem({ post, admin = false }) {
  const wordCount = post?.content.trim().split(/\s+/g).length;
  const minutesToRead = (wordCount / 100 + 1).toFixed(0);

  return (
    <div className="bg-white p-6 rounded-md border flex flex-col gap-4 my-4">
      <div className="flex justify-between">
        <Link className="text-sm" href={`/${post.username}`}>
          <strong>By @{post.username}</strong>
        </Link>
        {admin &&
          (post.published ? (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
              Published
            </span>
          ) : (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
              Draft
            </span>
          ))}
      </div>

      <Link
        className="text-xl font-bold"
        href={`/${post.username}/${post.slug}`}
      >
        <h2>{post.title}</h2>
      </Link>

      <footer className="flex justify-between">
        <span>
          {wordCount} words. {minutesToRead} min read
        </span>
        <span className="flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-red-500 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>{" "}
          {post.heartCount} Hearts
        </span>
      </footer>
      {/* If admin view, show extra controls for user */}
      {admin && (
        <>
          <Link href={`/admin/${post.slug}`}>
            <h3>
              <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none ">
                Edit
              </button>
            </h3>
          </Link>
        </>
      )}
    </div>
  );
}
