export const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <p className="flex items-center">
                <span className="font-medium">Counselling HOD:</span>
                <a href="tel:+2348162495328" className="ml-2 hover:text-blue-300 transition-colors">
                  +234 816 249 5328
                </a>
              </p>
              <p className="flex items-center">
                <span className="font-medium">Counselling AHOD:</span>
                <a href="tel:+2348141689142" className="ml-2 hover:text-blue-300 transition-colors">
                  +234 814 168 9142
                </a>
              </p>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Book Counselling Session</h3>
            <div className="space-y-2">
              <a 
                href="https://calendly.com/your-link" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block text-blue-300 hover:text-blue-400 transition-colors"
              >
                Schedule your session via Calendly
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p>&copy; {new Date().getFullYear()} YMR Counselling Unit. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};