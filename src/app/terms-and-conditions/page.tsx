export default function TermsAndConditionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Terms and Conditions
          </h1>
          <p className="text-lg text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
          
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              By accessing and using Language Teacher v2 (&ldquo;the App,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          {/* Description of Service */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Description of Service
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Language Teacher v2 is a comprehensive language learning application that provides interactive tools for learning Japanese, Thai, and other languages. Our services include kanji posters, practice sessions, quizzes, dictionaries, and progress tracking features.
            </p>
          </section>

          {/* User Accounts */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. User Accounts and Registration
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                To access certain features of our App, you may be required to create an account. You agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security of your password and account</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>
            </div>
          </section>

          {/* Acceptable Use */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Acceptable Use Policy
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                You agree to use the App only for lawful purposes and in accordance with these Terms. You agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Use the App in any way that violates any applicable federal, state, local, or international law</li>
                <li>Attempt to gain unauthorized access to any part of the App or any systems or networks</li>
                <li>Interfere with or disrupt the App or servers connected to the App</li>
                <li>Use any automated means to access or interact with the App</li>
                <li>Share your account credentials with others</li>
                <li>Use the App for commercial purposes without our written consent</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Intellectual Property Rights
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The App and its entire contents, features, and functionality are owned by us and are protected by copyright, trademark, and other intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Copy, modify, or distribute any content from the App</li>
                <li>Reverse engineer, decompile, or disassemble the App</li>
                <li>Remove any copyright or proprietary notices</li>
                <li>Use our trademarks or service marks without permission</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Note:</strong> Dictionary data (JMdict, KANJIDIC2) is sourced from third-party providers and is subject to their respective licensing terms.
              </p>
            </div>
          </section>

          {/* User Content */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. User Content and Contributions
            </h2>
            <p className="text-gray-700 leading-relaxed">
              You retain ownership of any content you submit to the App. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, and distribute your content in connection with the App. You represent that you have all necessary rights to grant this license.
            </p>
          </section>

          {/* Privacy and Data */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Privacy and Data Protection
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. Please review our Privacy Policy to understand our practices.
            </p>
          </section>

          {/* Subscription and Payment */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Subscription and Payment Terms
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                Some features of the App may require a subscription or payment. By purchasing a subscription, you agree to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Pay all fees associated with your subscription</li>
                <li>Provide accurate billing information</li>
                <li>Authorize us to charge your payment method</li>
                <li>Cancel your subscription in accordance with our cancellation policy</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Free Features:</strong> Basic features of the App are available free of charge, including access to the kanji poster and basic practice tools.
              </p>
            </div>
          </section>

          {/* Disclaimers */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. Disclaimers and Limitations
            </h2>
            <div className="space-y-4">
              <p className="text-gray-700 leading-relaxed">
                The App is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without warranties of any kind. We disclaim all warranties, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Warranties of merchantability and fitness for a particular purpose</li>
                <li>Warranties that the App will be uninterrupted or error-free</li>
                <li>Warranties regarding the accuracy or completeness of content</li>
                <li>Warranties that defects will be corrected</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>Learning Disclaimer:</strong> While we strive to provide accurate language learning content, we cannot guarantee that using our App will result in language proficiency. Learning outcomes depend on individual effort and practice.
              </p>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              In no event shall we be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the App.
            </p>
          </section>

          {/* Termination */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Termination
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may terminate or suspend your account and access to the App immediately, without prior notice, for any reason, including breach of these Terms. Upon termination, your right to use the App will cease immediately.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Governing Law and Dispute Resolution
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction]. Any disputes arising from these Terms or your use of the App shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization].
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the &ldquo;Last updated&rdquo; date. Your continued use of the App after such changes constitutes acceptance of the new Terms.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              14. Severability
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
            </p>
          </section>

          {/* Contact Information */}
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              15. Contact Information
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700">
                <strong>Email:</strong> contact@languageteacher.com<br/>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  )
}
