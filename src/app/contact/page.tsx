export default function Contact() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div className="absolute inset-0 bg-white" style={{ clipPath: 'polygon(0 0, 100% 0, 80% 100%, 0 100%)' }}></div>
              <div className="absolute inset-0 bg-black" style={{ clipPath: 'polygon(20% 0, 100% 0, 100% 100%, 0 100%)' }}></div>
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              CONTACT US
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Get in touch with our team for support and inquiries
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
                GET IN TOUCH
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 tracking-wider">
                    EMAIL
                  </h3>
                  <p className="text-gray-700">
                    contact@languageteacher.com
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 tracking-wider">
                    SUPPORT HOURS
                  </h3>
                  <p className="text-gray-700">
                    Monday - Friday: 9:00 AM - 6:00 PM EST<br/>
                    Weekend: 10:00 AM - 4:00 PM EST
                  </p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-black mb-2 tracking-wider">
                    RESPONSE TIME
                  </h3>
                  <p className="text-gray-700">
                    We typically respond to inquiries within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
                SEND MESSAGE
              </h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                    placeholder="Your full name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200"
                    placeholder="What is this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-black mb-2 tracking-wider uppercase">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 border-2 border-black bg-white text-black placeholder-gray-500 focus:outline-none focus:border-gray-600 transition-colors duration-200 resize-none"
                    placeholder="Tell us more about your inquiry..."
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-3 px-6 bg-black text-white hover:bg-gray-800 transition-all duration-200 font-medium tracking-wider border-2 border-black hover:font-fugaz"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-8">
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
            <div className="w-2 h-2 bg-black"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
