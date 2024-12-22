import { Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-[#1A1F2C]/90 backdrop-blur-lg text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Contact Us
            </h3>
            <div className="h-1 w-20 bg-gradient-to-r from-purple-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center justify-center space-x-6">
                <div className="flex items-center space-x-3 bg-white/5 px-4 py-3 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">Counselling HOD</p>
                    <a 
                      href="tel:+2348162495328" 
                      className="text-white hover:text-purple-400 transition-colors"
                    >
                      +234 816 249 5328
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 bg-white/5 px-4 py-3 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                  <Mail className="h-5 w-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">Counselling AHOD</p>
                    <a 
                      href="tel:+2348141689142" 
                      className="text-white hover:text-blue-400 transition-colors"
                    >
                      +234 814 168 9142
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t border-gray-800/50 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} YMR Counselling Unit. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};