import Link from "next/link";

const Navbar = () => {
    return (
        <nav className="flex justify-between p-4">
          <Link href="/" className="flex p-4">Home</Link>
          <div className="flex">
            <Link href="/signup" className="flex p-4">SignUp</Link>
            <Link href="/login" className="flex p-4">Login</Link>
            <Link href="/backlog" className="flex p-4">Backlog</Link>
          </div>
        </nav>
    );
};

export default Navbar;