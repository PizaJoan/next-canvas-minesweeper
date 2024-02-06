import Link from 'next/link';

// TODO: add is active condition and some styles to make it look cool
export const Navbar = () => {
  return (
    <header className="flex flex-row justify-center gap-5 pt-10">
      <Link href="/">Home</Link>
      <Link href="/game">Game</Link>
      <Link href="/leaderboard">Leaderboard</Link>
    </header>
  );
};
