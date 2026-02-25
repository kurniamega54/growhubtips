import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-[#4E342E] text-white py-10">
      <div className="container mx-auto grid grid-cols-3 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">About GrowHubTips</h3>
          <p className="text-sm">
            GrowHubTips is your go-to resource for home gardening, indoor plants, urban farming, and plant care troubleshooting.
          </p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link href="/" className="hover:text-[#8E9775] transition-colors">Home</Link></li>
            <li><Link href="/categories" className="hover:text-[#8E9775] transition-colors">Categories</Link></li>
            <li><Link href="/about" className="hover:text-[#8E9775] transition-colors">About</Link></li>
            <li><Link href="/contact" className="hover:text-[#8E9775] transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Stay Connected</h3>
          <p className="text-sm">Follow us on social media for the latest tips and updates.</p>
          <ul className="flex space-x-4 mt-4">
            <li><a href="#" className="hover:text-[#8E9775] transition-colors">Facebook</a></li>
            <li><a href="#" className="hover:text-[#8E9775] transition-colors">Twitter</a></li>
            <li><a href="#" className="hover:text-[#8E9775] transition-colors">Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;