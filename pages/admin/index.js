import {
  collection,
  doc,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import AuthCheck from "../../components/AuthCheck";
import { auth, firestore } from "../../lib/firebase";
import { useCollection } from "react-firebase-hooks/firestore";
import PostFeed from "../../components/PostFeed";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import { UserContext } from "../../lib/context";
import kebabCase from "lodash.kebabcase";
import { toast } from "react-hot-toast";

export default function AdminPostsPage({}) {
  return (
    <main className="max-w-7xl mx-auto w-full px-10">
      <AuthCheck>
        <PostList />
        <CreateNewPost />
      </AuthCheck>
    </main>
  );
}

function PostList() {
  const postsQuery = query(
    collection(doc(firestore, "users", auth.currentUser.uid), "posts"),
    orderBy("createdAt")
  );

  const [querySnapshot] = useCollection(postsQuery);

  const posts = querySnapshot?.docs.map((doc) => doc.data());

  return (
    <>
      <h1 className="text-3xl font-bold">Manage your Posts</h1>
      <PostFeed posts={posts} admin />
    </>
  );
}

function CreateNewPost() {
  const router = useRouter();
  const { username } = useContext(UserContext);
  const [title, setTitle] = useState("");

  const slug = encodeURI(kebabCase(title));

  // TODO: Check if the post slug exists
  const isValid = title.length > 3 && title.length < 100;

  async function createPost(e) {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = doc(firestore, "users", uid, "posts", slug);

    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: "# hello world!",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await setDoc(ref, data);

    toast.success("Post created!");

    router.push(`/admin/${slug}`);
  }

  return (
    <form onSubmit={createPost}>
      <input
        className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button
        type="submit"
        className="mt-4 focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        disabled={!isValid}
      >
        Create New Post
      </button>
    </form>
  );
}
