import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="sticky top-0 bg-[#2D5A27] text-white shadow-md z-50">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <h1 className="text-2xl font-bold">GrowHubTips</h1>
        <ul className="flex space-x-6">
          <li>
            <Link href="/">
              <a className="hover:text-[#8E9775] transition-colors">Home</a>
            </Link>
          </li>
          <li>
            <Link href="/categories">
              <a className="hover:text-[#8E9775] transition-colors">Categories</a>
            </Link>
          </li>
          <li>
            <Link href="/about">
              <a className="hover:text-[#8E9775] transition-colors">About</a>
            </Link>
          </li>
          <li>
            <Link href="/contact">
              <a className="hover:text-[#8E9775] transition-colors">Contact</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;