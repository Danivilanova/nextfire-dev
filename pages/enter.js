import { async } from "@firebase/util";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, getDoc, writeBatch } from "firebase/firestore";
import debounce from "lodash.debounce";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, firestore, googleAuthProvider } from "../lib/firebase";

export default function EnterPage({}) {
  const { user, username } = useContext(UserContext);

  return (
    <main className="p-10 max-w-7xl w-full mx-auto">
      {user ? (
        !username ? (
          <UsernameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider);
  };

  return (
    <button
      onClick={signInWithGoogle}
      className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2 mb-2"
    >
      <svg
        className="w-4 h-4 mr-2 -ml-1"
        aria-hidden="true"
        focusable="false"
        data-prefix="fab"
        data-icon="google"
        role="img"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 488 512"
      >
        <path
          fill="currentColor"
          d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
        ></path>
      </svg>
      Sign in with Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button
      onClick={() => signOut(auth)}
      className="focus:outline-none text-white bg-red-500 hover:bg-red-600 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
    >
      Sign Out
    </button>
  );
}

function UsernameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username } = useContext(UserContext);

  const onSubmit = async (e) => {
    e.preventDefault();

    const userRef = doc(firestore, `users/${user.uid}`);
    const usernameRef = doc(firestore, `usernames/${formValue}`);

    const batch = writeBatch(firestore);
    batch.set(userRef, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernameRef, { uid: user.uid });

    await batch.commit();
  };

  const onChange = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=.*[a-zA-Z]{0,})(?=.*[\d]{0,})[a-zA-Z0-9]{0,15}$/;

    if (re.test(val)) {
      setFormValue(val);
      setLoading(!(val.length < 3));
      setIsValid(false);
    }
  };

  const checkUsername = useCallback(
    debounce(async (username) => {
      if (username.length >= 3) {
        const ref = doc(firestore, `usernames/${username}`);
        const docSnap = await getDoc(ref);
        console.log("Firestore read executed!");
        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  useEffect(() => {
    checkUsername(formValue);
  }, [formValue]);

  return (
    !username && (
      <section className="mx-auto bg-white rounded-xl p-10 flex flex-col justify-center items-center max-w-xl border">
        <h3>Choose Username</h3>
        <form onSubmit={onSubmit} className="flex flex-col items-center">
          <input
            className="my-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={onChange}
          />
          <UsernameMessage
            username={formValue}
            isValid={isValid}
            loading={loading}
          />
          <button
            type="submit"
            className="mt-4 focus:outline-none text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
            disabled={!isValid}
          >
            Choose
          </button>
          <h3>Debug State</h3>
          <div>
            Username: {formValue}
            <br />
            Loading: {loading.toString()}
            <br />
            Username Valid: {isValid.toString()}
          </div>
        </form>
      </section>
    )
  );
}

function UsernameMessage({ username, isValid, loading }) {
  if (loading) {
    return <p>Checking...</p>;
  } else if (isValid) {
    return <p className="text-green-500">{username} is available!</p>;
  } else if (username.length < 3) {
    return <p className="text-red-500">That username is too short!</p>;
  } else if (username && !isValid) {
    return <p className="text-red-500">That username is taken!</p>;
  } else {
    return <p></p>;
  }
}
