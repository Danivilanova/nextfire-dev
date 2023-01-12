import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useState } from "react";
import { auth, storage } from "../lib/firebase";
import Loader from "./Loader";

export default function ImageUploader() {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [downloadURL, setDownloadURL] = useState(null);

  const uploadFile = (e) => {
    const file = Array.from(e.target.files)[0];
    const extension = file.type.split("/")[1];

    const imageRef = ref(
      storage,
      `uploads/${auth.currentUser.uid}/${Date.now()}.${extension}`
    );
    setUploading(true);

    const task = uploadBytesResumable(imageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        const p = (
          (snapshot.bytesTransferred / snapshot.totalBytes) *
          100
        ).toFixed(0);
        setProgress(p);
      },
      (error) => {},
      () => {
        getDownloadURL(task.snapshot.ref).then((dURL) => {
          setDownloadURL(dURL);
          setUploading(false);
        });
      }
    );
  };

  return (
    <div className="flex gap-4 items-center">
      <Loader show={uploading} />
      {uploading && <h3>{progress}%</h3>}

      {!uploading && (
        <>
          <label className="text-black bg-gray-200 hover:bg-gray-300 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-non cursor-pointer shrink-0">
            📷 Upload Img
            <input
              className="hidden"
              type="file"
              onChange={uploadFile}
              accept="image/x-png,image/gif,image/jpeg"
            />
          </label>
        </>
      )}

      {downloadURL && (
        <code className="text-sm break-all border p-2 rounded-md">{`![alt](${downloadURL})`}</code>
      )}
    </div>
  );
}
