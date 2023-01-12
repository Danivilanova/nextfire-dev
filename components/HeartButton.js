import { doc, increment, writeBatch } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { auth, firestore } from "../lib/firebase";

export default function HeartButton({ postRef }) {
  const uid = auth.currentUser.uid;
  const heartRef = doc(postRef, "hearts", uid);
  const [heartDoc] = useDocument(heartRef);

  const removeHeart = async () => {
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartRef);

    await batch.commit();
  };

  const addHeart = async () => {
    const batch = writeBatch(firestore);

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartRef, { uid });

    await batch.commit();
  };

  return heartDoc?.exists() ? (
    <button
      className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
      onClick={removeHeart}
    >
      💔 Unheart
    </button>
  ) : (
    <button
      className="py-2.5 px-5 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-200"
      onClick={addHeart}
    >
      ❤️ Heart
    </button>
  );
}
