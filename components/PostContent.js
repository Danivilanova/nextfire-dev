import Link from "next/link";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";

export default function PostContent({ post }) {
  const createdAt =
    typeof post.createdAt === "number"
      ? new Date(post.createdAt)
      : post.createdAt.toDate();
  return (
    <div className="bg-white p-6 rounded-md border flex flex-col gap-4">
      <h1 className="text-3xl font-bold">{post?.title}</h1>
      <span className="text-sm">
        Written by <Link href={`/${post.username}/`}>@{post.username}</Link> on{" "}
        {createdAt.toISOString()}
      </span>

      <ReactMarkdown className="prose">{post?.content}</ReactMarkdown>
    </div>
  );
}
