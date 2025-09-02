export default function About() {
  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-4 mb-8">
            {/* Sharp geometric logo */}
            <div className="w-12 h-12 bg-black relative">
              <div
                className="absolute inset-0 bg-white"
                style={{ clipPath: "polygon(0 0, 100% 0, 80% 100%, 0 100%)" }}
              />
              <div
                className="absolute inset-0 bg-black"
                style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0 100%)" }}
              />
            </div>
            <h1 className="text-4xl font-bold text-black tracking-wider">
              ABOUT US
            </h1>
          </div>
          <div className="h-px w-32 bg-black mx-auto mb-6" />
          <p className="text-gray-700 tracking-wide">
            Purpose-built for Asian scripts.<br />
            <span className="font-medium">
              The smartest way to master massive alphabets—kanji, hanzi, kana, hangul—backed by real progress stats.
            </span>
          </p>
        </div>

        {/* Content */}
        <div className="border-2 border-black p-12">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              OUR MISSION
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Language Teacher helps dedicated learners conquer character-heavy languages by removing guesswork from study.
              We turn thousands of characters into a clear roadmap—showing exactly what you know, what you almost know,
              and what to learn next—so effort goes where it matters.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              WHY ALPHABETS ARE HARD
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              In Japanese, Chinese, and Korean, progress can feel invisible. Lists get long, reviews pile up,
              and it’s easy to lose track of coverage and retention. Traditional apps treat characters like vocab cards;
              we treat them like a system—radicals, frequency, stroke order, readings, and usage—so you build durable skill,
              not just short-term recall.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              WHAT WE DO
            </h2>
            <ul className="text-gray-700 mb-8 leading-relaxed list-disc pl-6 space-y-3">
              <li>
                <span className="font-semibold">Progress Map:</span> a live coverage dashboard that tracks learned, shaky,
                and unknown characters—by level (JLPT/HSK), frequency, and radical.
              </li>
              <li>
                <span className="font-semibold">Adaptive Reviews:</span> spaced repetition tuned to stroke accuracy,
                readings, and confusion pairs to prevent “near-miss” plateaus.
              </li>
              <li>
                <span className="font-semibold">Weakness Radar:</span> automatic drills for the things you miss most
                (look-alikes, irregular readings, tricky components).
              </li>
              <li>
                <span className="font-semibold">Multi-Dictionary Search:</span> fast lookups across curated Japanese/Chinese
                dictionaries with example sentences and frequency insights.
              </li>
              <li>
                <span className="font-semibold">Skill Benchmarks:</span> clear milestones aligned with JLPT/HSK and custom goals,
                so you always know how close you are to the next level.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              OUR APPROACH
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  DATA-DRIVEN LEARNING
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Every review updates your personal model. We analyze accuracy, speed, and lapse patterns to schedule the
                  right item at the right time.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  COMPONENT FIRST
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Master radicals and parts before the whole character. Decompose, learn, then recombine—faster retention, fewer plateaus.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  PRACTICE THAT TRANSFERS
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Mix recognition, reading, and recall with real-world examples, so knowledge survives outside the app.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-black mb-3 tracking-wider">
                  BUILT WITH LEARNERS
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We ship based on feedback from serious students and teachers. If it doesn’t improve retention or clarity, it doesn’t ship.
                </p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              WHO IT’S FOR
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Self-motivated learners of Japanese, Chinese, and Korean who want accountability and precision.
              If you like seeing exactly what’s working—and what isn’t—you’ll feel at home here.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              LOOKING FORWARD
            </h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              Next up: handwriting practice with stroke-level feedback, OCR-based reading quizzes, and deeper corpus stats.
              Our goal is simple—be the best place to master large alphabets with confidence.
            </p>

            <h2 className="text-2xl font-bold text-black tracking-wider mb-6">
              JOIN US
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Whether you’re aiming for JLPT N2, HSK 4, or your first 500 characters, start with a clear map and measurable progress.
              Track it. Train it. Own it.
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="text-center mt-16">
          <div className="flex justify-center space-x-8">
            <div className="w-2 h-2 bg-black" />
            <div className="w-2 h-2 bg-black" />
            <div className="w-2 h-2 bg-black" />
          </div>
        </div>
      </div>
    </div>
  );
}
