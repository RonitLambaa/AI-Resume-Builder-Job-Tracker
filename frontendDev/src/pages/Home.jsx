
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Home = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="container mx-auto px-6 md:px-0 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-20 mb-6 bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Build smarter resumes. Track your job applications.
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            AI-assisted resume builder + job tracker built for developers.
            Create targeted resumes, get AI suggestions, and follow your applications in one place.
          </p>

          <div className="flex items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg 
                         transition duration-200 hover:bg-blue-50"
            >
              Sign In
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Features */}
      <motion.section
        className="py-12"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-0">
          <h2 className="text-2xl font-semibold text-center mb-8">What you get</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI Resume Suggestions",
                description: "Use powerful AI to improve your summary and bullet points — tailored for each job."
              },
              {
                title: "Multiple Resumes",
                description: "Create and manage different resumes for Backend, DSA, Frontend or any role."
              },
              {
                title: "Job Tracker",
                description: "Track applications, interviews, offers and notes — all in one dashboard."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                className="bg-white p-6 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
              >
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Simple CTA */}
      <motion.section
        className="py-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto px-6 md:px-0 text-center">
          <div className="inline-block bg-white p-8 rounded-2xl shadow">
            <h3 className="text-xl font-semibold mb-2">Ready to get hired?</h3>
            <p className="text-gray-600 mb-4">Sign up and create your first resume in minutes.</p>
            <Link
              to="/signup"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Resume
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
