export default function TermsAndConditions() {
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
              TERMS & CONDITIONS
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 tracking-wide">
            Please read these terms and conditions carefully before using our service
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              ACCEPTANCE OF TERMS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              By accessing and using Language Teacher, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              USE LICENSE
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Permission is granted to temporarily download one copy of the materials (information or software) on Language Teacher&apos;s website for personal, non-commercial transitory viewing only.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              DISCLAIMER
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The materials on Language Teacher&apos;s website are provided on an &apos;as is&apos; basis. Language Teacher makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              LIMITATIONS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              In no event shall Language Teacher or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Language Teacher&apos;s website.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              ACCURACY OF MATERIALS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              The materials appearing on Language Teacher&apos;s website could include technical, typographical, or photographic errors. Language Teacher does not warrant that any of the materials on its website are accurate, complete or current.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              LINKS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Language Teacher has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Language Teacher of the site.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              MODIFICATIONS
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Language Teacher may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms and Conditions of Use.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              GOVERNING LAW
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
