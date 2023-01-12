import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <div className="flex flex-col items-center">
      <Image
        src={user.photoURL}
        alt="Avatar"
        width={100}
        height={100}
        className="rounded-full mt-10"
      />
      <p className="mt-3">
        <i>@{user.username}</i>
      </p>
      <h1 className="text-3xl font-bold mt-10">{user.displayName}</h1>
    </div>
  );
}
