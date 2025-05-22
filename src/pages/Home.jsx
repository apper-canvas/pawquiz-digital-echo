import { useState } from 'react';
import MainFeature from '../components/MainFeature';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const PawPrintIcon = getIcon('paw-print');
const BrainIcon = getIcon('brain');
const TrophyIcon = getIcon('trophy');

const Home = () => {
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);

  const handleQuizCompletion = (correct, total) => {
    setCorrectAnswers(prev => prev + correct);
    setTotalQuestions(prev => prev + total);
  };

  const features = [
    {
      icon: <PawPrintIcon className="w-10 h-10 text-primary" />,
      title: "120+ Dog Breeds",
      description: "Explore and learn about over 120 different dog breeds from around the world."
    },
    {
      icon: <BrainIcon className="w-10 h-10 text-primary" />,
      title: "Test Your Knowledge",
      description: "Challenge yourself with our dog breed identifier quiz and see how many you can correctly identify."
    },
    {
      icon: <TrophyIcon className="w-10 h-10 text-primary" />,
      title: "Track Progress",
      description: "Monitor your learning journey and see improvement as you play more quizzes."
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="mb-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <motion.h1 
              className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Test Your <span className="text-primary">Dog Breed</span> Knowledge
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 dark:text-gray-300 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Challenge yourself with our interactive dog breed quiz, learn interesting facts, and become a canine expert!
            </motion.p>
            
            {totalQuestions > 0 && (
              <motion.div 
                className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="font-semibold mb-2">Your Stats</h3>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Questions</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalQuestions}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Correct Answers</p>
                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctAnswers}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Accuracy</p>
                    <p className="text-2xl font-bold text-primary">
                      {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative z-10"
            >
              <img 
                src="https://images.unsplash.com/photo-1529429617124-95b109e86bb8?auto=format&fit=crop&q=80&w=600"
                alt="Dogs of different breeds" 
                className="rounded-2xl shadow-lg object-cover h-64 w-full md:h-80"
              />
            </motion.div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-primary/20 rounded-2xl -z-10"></div>
          </div>
        </div>
      </section>

      {/* Main Quiz Feature */}
      <section className="mb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            Dog Breed Quiz
          </h2>
          <MainFeature onQuizComplete={handleQuizCompletion} />
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">Why PawQuiz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="neu-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;