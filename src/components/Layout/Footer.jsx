const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto py-6 px-6 border-t border-gray-200 text-center sm:text-left bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
        
        {/* Copyright */}
        <p>
          &copy; {currentYear} <span className="font-semibold text-primary">LuxuryStay Hospitality</span>. All rights reserved.
        </p>

        {/* Links */}
        <div className="flex gap-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-primary transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;