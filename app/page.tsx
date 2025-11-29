import Link from "next/link";
export default function Home() {
  return (
    <div>
      <h1 className="text-3xl font-bold underline">Hello, Next.js 16!</h1>
      <Link href="/users" className="text-blue-500 underline">
        Go to Users Page
      </Link>
    </div>
  );
}
