import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white text-black pt-8 pb-8 px-4 mt-10">
      <div className="max-w-7xl mx-auto">

        {/* Main Footer */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Logo Section */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-0">
              <div className="p-1 rounded-lg -mt-2">
                <img
                  src="/logo.png"
                  alt="Read-E-Verse Logo"
                  className="w-8 h-9 object-contain"
                />
              </div>

              <span className="text-xl font-bold tracking-wide -translate-y-1">
                READ-E-<span className="text-primary">VERSE</span>
              </span>
            </Link>

            <p className="text-gray-600 text-sm leading-7">
              The ultimate AI-powered ecosystem for modern readers and avid listeners.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Browse Books
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Audiobooks
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Recommendations
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Help Center
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>

            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>

              <li>
                <Link href="#" className="hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-6 border-t border-gray-200 flex items-center justify-center">
          <p className="text-gray-600 text-sm">
            © 2026 READ-E-VERSE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}