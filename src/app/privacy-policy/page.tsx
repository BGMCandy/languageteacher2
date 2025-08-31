export default function PrivacyPolicy() {
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
              PRIVACY POLICY
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            How we collect, use, and protect your personal information
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              INFORMATION WE COLLECT
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support. This may include your name, email address, and any other information you choose to provide.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              HOW WE USE YOUR INFORMATION
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to develop new features. We may also use your information to send you updates about our services.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              INFORMATION SHARING
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with service providers who assist us in operating our website and providing our services.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              DATA SECURITY
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              COOKIES AND TRACKING
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We use cookies and similar tracking technologies to enhance your experience on our website. You can control cookie settings through your browser preferences.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              YOUR RIGHTS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              You have the right to access, update, or delete your personal information. You may also opt out of certain communications from us. Contact us if you need assistance with any of these requests.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              CHANGES TO THIS POLICY
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              CONTACT US
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              If you have any questions about this privacy policy, please contact us. We are committed to protecting your privacy and will respond to your inquiries promptly.
            </p>
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
