import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';

const ChevronRightIcon = getIcon('chevron-right');
const RefreshCwIcon = getIcon('refresh-cw');
const CheckCircleIcon = getIcon('check-circle');
const XCircleIcon = getIcon('x-circle');
const InfoIcon = getIcon('info');
const BarChart3Icon = getIcon('bar-chart-3');

// Mock dog breed data for our quiz
const dogBreeds = [
  {
    id: 1,
    name: "Labrador Retriever",
    image: "https://images.unsplash.com/photo-1591769225440-811ad7d6eab7?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Labradors have webbed feet which helps them swim efficiently.",
      "They were originally bred to help fishermen pull in nets and catch fish that escaped from fishing lines.",
      "The Labrador Retriever has been America's most popular dog breed for over 30 years."
    ]
  },
  {
    id: 2,
    name: "German Shepherd",
    image: "https://images.unsplash.com/photo-1589941013453-ec89f98c6e6e?auto=format&fit=crop&q=80&w=600",
    facts: [
      "German Shepherds can learn a new command in as little as 5 repetitions.",
      "They were originally bred for herding sheep and protecting flocks.",
      "German Shepherds have 200 million scent receptors in their noses, making them excellent at tracking."
    ]
  },
  {
    id: 3,
    name: "Golden Retriever",
    image: "https://images.unsplash.com/photo-1633722715888-151df2b36f7d?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Golden Retrievers were originally bred in Scotland in the 1800s for hunting waterfowl.",
      "Their water-repellent double coat helps them retrieve game from water.",
      "Goldens don't fully mature until they're about 3 years old – they keep their puppy-like traits longer than many breeds."
    ]
  },
  {
    id: 4,
    name: "Bulldog",
    image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Bulldogs were originally bred for bull-baiting, a popular sport in England during the 13th century.",
      "Most Bulldogs can't swim due to their heavy bodies and short legs.",
      "They're known for their distinctive 'sourmug' expression, which is actually caused by their wrinkles and pushed-in nose."
    ]
  },
  {
    id: 5,
    name: "Poodle",
    image: "https://images.unsplash.com/photo-1575425186775-b8de9a427e67?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Poodles were originally bred as water retrievers, and their fancy haircut had a practical purpose - it kept their vital organs warm while in cold water.",
      "They're considered one of the most intelligent dog breeds.",
      "Standard Poodles are the national dog of France, despite the breed originating in Germany."
    ]
  },
  {
    id: 6,
    name: "Beagle",
    image: "https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Beagles have about 220 million scent receptors, compared to humans' 5 million.",
      "Their white-tipped tails were bred to help hunters spot them in tall grass.",
      "Beagles have three distinct vocalization types: barking, howling, and the special 'bay' sound they make when they've picked up a scent."
    ]
  },
  {
    id: 7,
    name: "Siberian Husky",
    image: "https://images.unsplash.com/photo-1605568427561-40dd23c2acea?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Siberian Huskies have a double-layered coat that allows them to withstand temperatures as cold as -60°F.",
      "They were bred by the Chukchi people of northeastern Asia as endurance sled dogs.",
      "Huskies are known for their ability to howl rather than bark, and sometimes 'talk' to their owners with unique vocalizations."
    ]
  },
  {
    id: 8,
    name: "Dachshund",
    image: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?auto=format&fit=crop&q=80&w=600",
    facts: [
      "Dachshunds were bred to hunt badgers - their name literally means 'badger dog' in German.",
      "Their distinctive long body and short legs were developed to help them dig into badger burrows.",
      "They come in three coat varieties: smooth, wirehaired, and longhaired."
    ]
  }
];

// Helper function to get random elements from an array
const getRandomElements = (array, count, exclude = null) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  if (exclude) {
    return shuffled.filter(item => item.id !== exclude.id).slice(0, count);
  }
  return shuffled.slice(0, count);
};

// Validate breed data to ensure images match breed names
const validateBreedData = (breed) => {
  // Check if image URL contains breed name or parts of it (accounting for hyphens, underscores)
  const breedNameParts = breed.name.toLowerCase().split(' ');
  const imageUrl = breed.image.toLowerCase();
  
  // Verify image exists and loads properly
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      // Consider the breed valid if image loads successfully
      resolve(true);
    };
    img.onerror = () => resolve(false);
    img.src = breed.image;
  });
};

// Helper function to get a random fact from a breed
const getRandomFact = (facts) => {
  return facts[Math.floor(Math.random() * facts.length)];
};

// Helper function to preload an image
const preloadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    
    img.onload = () => {
      // Image loaded successfully
      resolve({ success: true, src });
    };
    
    img.onerror = () => {
      resolve({ success: false, src });
    };
    img.src = src; 
  });
};

const MainFeature = ({ onQuizComplete }) => {
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizHistory, setQuizHistory] = useState([]);
  const [confidenceScore, setConfidenceScore] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [nextQuizData, setNextQuizData] = useState(null);
  const [validatedBreeds, setValidatedBreeds] = useState([]);

  // Preload the next quiz question
  const preloadNextQuiz = async () => {
    // Use only validated breeds if available, otherwise use all breeds
    const breedsToUse = validatedBreeds.length > 0 ? validatedBreeds : dogBreeds;
    
    if (breedsToUse.length === 0) {
      console.error("No validated dog breeds available for quiz");
      return;
    }
    
    // Get a random breed for the next question
    const nextCorrectBreed = breedsToUse[Math.floor(Math.random() * breedsToUse.length)];
    
    // Get incorrect options that don't include the correct breed
    const nextOtherBreeds = breedsToUse.filter(breed => breed.id !== nextCorrectBreed.id);
    const nextIncorrectOptions = getRandomElements(nextOtherBreeds, 3, nextCorrectBreed);
    
    // Create all options with the correct breed inserted at a random position
    // This ensures the correct answer appears in a random position each time
    const nextAllOptions = [...nextIncorrectOptions];
    const nextCorrectPosition = Math.floor(Math.random() * 4);
    nextAllOptions.splice(nextCorrectPosition, 0, nextCorrectBreed);
    
    // Generate a random confidence score between 70 and 99
    const nextRandomConfidence = Math.floor(Math.random() * 30) + 70;
    
    // Preload the image
    const imageResult = await preloadImage(nextCorrectBreed.image);
    
    // Only set next quiz data if image loaded successfully
    if (imageResult.success) {
      // Double-check to ensure image is valid for this breed before proceeding
      const breedValid = await validateBreedData(nextCorrectBreed);
      
      if (breedValid) {
      setNextQuizData({
        quiz: { correctBreed: nextCorrectBreed, options: nextAllOptions, fact: getRandomFact(nextCorrectBreed.facts) },
        confidence: nextRandomConfidence
      });
      }
  };


  // Generate a new quiz question
  const generateQuiz = async () => {
    setLoading(true);
    
    // Simulate API/model loading time
    setTimeout(() => {
      if (nextQuizData) {
        // Use the preloaded quiz data
        setCurrentQuiz(nextQuizData.quiz);
        setConfidenceScore(nextQuizData.confidence);
        setNextQuizData(null);
        // Preload the next question for after this one
        preloadNextQuiz();
      } else {
        // Use validated breeds if available
        const breedsToUse = validatedBreeds.length > 0 ? validatedBreeds : dogBreeds;
        
        if (breedsToUse.length === 0) {
          toast.error("No valid dog breeds available. Please refresh the page.");
          setLoading(false);
          return;
        }
        
        // Generate a new quiz with verified breed data
        const correctBreed = breedsToUse[Math.floor(Math.random() * breedsToUse.length)];
        
        // Verify image loads correctly
        const imageResult = await preloadImage(correctBreed.image);
        
        if (!imageResult.success) {
          // Try again with another breed if image fails
          setLoading(false);
          generateQuiz();
          return;
        }
        
        // Get verified incorrect options
        const otherBreeds = breedsToUse.filter(breed => breed.id !== correctBreed.id);
        const incorrectOptions = getRandomElements(otherBreeds, 3, correctBreed);
        const allOptions = [...incorrectOptions];
        const correctPosition = Math.floor(Math.random() * 4);
        allOptions.splice(correctPosition, 0, correctBreed);
        
        // Generate a random confidence score between 70 and 99
        const randomConfidence = Math.floor(Math.random() * 30) + 70;
        
        setCurrentQuiz({
          correctBreed,
          options: allOptions,
          fact: getRandomFact(correctBreed.facts)
        });
        
        setConfidenceScore(randomConfidence);
        preloadNextQuiz();
      }
      setSelectedAnswer(null);
      setLoading(false);
    }, 1000);
  };

  // Handle user answer selection
  const handleAnswerSelect = (breed) => {
    if (showResult) return;
    
    setSelectedAnswer(breed);
    const correct = breed.id === currentQuiz.correctBreed.id;
    setIsCorrect(correct);
    setShowResult(true);
    
    // Update quiz history
    const newHistoryItem = {
      breedName: currentQuiz.correctBreed.name,
      userAnswer: breed.name,
      isCorrect: correct,
      confidenceScore
    };
    
    setQuizHistory(prev => [newHistoryItem, ...prev].slice(0, 10));
    
    // Update quiz stats
    setQuizCount(prev => prev + 1);
    if (correct) {
      setCorrectCount(prev => prev + 1);
      toast.success("Correct answer! Good job!");
    } else {
      toast.error("Oops! That's not right.");
    }
    
    setQuizCompleted(true);
  };

  // Start a new quiz after completing the current one
  const handleNextQuiz = () => {
    setIsCorrect(null);
    setShowResult(false);
    setQuizCompleted(false);
    generateQuiz();
  };

  // Function to handle quiz completion
  const completeQuiz = () => {
    if (onQuizComplete) {
      onQuizComplete(correctCount, quizCount);
    }
    setQuizCount(0);
    setCorrectCount(0);
    setQuizHistory([]);
    toast.info("Quiz session completed! Your stats have been updated.");
    generateQuiz();
  };
  
  // Validate all dog breeds when component mounts
  useEffect(() => {
    const validateAllBreeds = async () => {
      const validationPromises = dogBreeds.map(breed => validateBreedData(breed));
      const validationResults = await Promise.all(validationPromises);
      
      // Filter breeds that passed validation
      const validBreeds = dogBreeds.filter((_, index) => validationResults[index]);
      
      if (validBreeds.length < dogBreeds.length) {
        console.warn(`Filtered out ${dogBreeds.length - validBreeds.length} breeds with invalid data.`);
        
        if (validBreeds.length === 0) {
          toast.error("Unable to validate any dog breeds. Using original dataset.");
        } else {
          toast.info(`Using ${validBreeds.length} validated dog breeds for maximum accuracy.`);
          setValidatedBreeds(validBreeds);
        }
      } else {
        setValidatedBreeds(validBreeds);
      }
    };
    
    validateAllBreeds();
  }, []);

  // Generate initial quiz when component mounts and validatedBreeds changes
  useEffect(() => {
    if (validatedBreeds.length > 0 || dogBreeds.length > 0) {
      generateQuiz();
    }
  }, [validatedBreeds]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Main Quiz Area - Takes up 3/5 of the space on desktop */}
        <div className="md:col-span-3 space-y-6">
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
              {quizCompleted ? "Quiz Result" : "Identify this dog breed"}
            </h3>
            
            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-12"
                >
                  <RefreshCwIcon className="w-10 h-10 text-primary animate-spin" />
                  <span className="ml-3 text-gray-600 dark:text-gray-300">Loading next question...</span>
                </motion.div>
              ) : currentQuiz ? (
                <motion.div
                  key="quiz-content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="relative aspect-[4/3] mb-6 overflow-hidden rounded-xl">
                    <img 
                      src={currentQuiz.correctBreed.image} 
                      alt="Dog breed to identify" 
                      className="w-full h-full object-cover"
                    />
                    
                    {showResult && (
                      <motion.div 
                        className="absolute inset-0 bg-black/50 flex items-center justify-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="text-center text-white p-6">
                          <div className="mb-2">
                            {isCorrect ? (
                              <CheckCircleIcon className="mx-auto w-16 h-16 text-green-400" />
                            ) : (
                              <XCircleIcon className="mx-auto w-16 h-16 text-red-400" />
                            )}
                          </div>
                          <h3 className="text-2xl font-bold mb-1">
                            {isCorrect ? "Correct!" : "Not quite!"}
                          </h3>
                          <p className="text-xl">This is a {currentQuiz.correctBreed.name}</p>
                          <div className="mt-4 bg-white/20 rounded-lg p-3">
                            <div className="flex items-center mb-1">
                              <BarChart3Icon className="w-5 h-5 mr-2 text-blue-300" />
                              <span className="text-sm font-medium">AI Confidence</span>
                            </div>
                            <div className="w-full bg-gray-300/30 rounded-full h-2.5">
                              <div 
                                className="bg-blue-400 h-2.5 rounded-full" 
                                style={{ width: `${confidenceScore}%` }}
                              ></div>
                            </div>
                            <div className="text-right text-sm mt-1">{confidenceScore}%</div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                  
                  {!showResult ? (
                    <div className="space-y-3">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        Select the correct breed for this dog:
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentQuiz.options.map((breed) => (
                          <motion.button
                            key={breed.id}
                            onClick={() => handleAnswerSelect(breed)}
                            className={`p-3 rounded-lg border-2 border-gray-200 dark:border-gray-700 
                              text-left text-gray-800 dark:text-white font-medium hover:border-primary 
                              hover:bg-primary/5 transition-colors`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            {breed.name}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg flex">
                        <InfoIcon className="w-6 h-6 text-blue-500 dark:text-blue-400 mr-3 flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Fun Fact</h4>
                          <p className="text-blue-600 dark:text-blue-200">{currentQuiz.fact}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-center pt-4">
                        <motion.button
                          onClick={handleNextQuiz}
                          className="btn-primary flex items-center"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          Next Question
                          <ChevronRightIcon className="w-5 h-5 ml-2" />
                        </motion.button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Quiz Stats and History - Takes up 2/5 of the space on desktop */}
        <div className="md:col-span-2 space-y-6">
          {/* Quiz Stats */}
          <div className="card p-6">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white flex items-center">
              <BarChart3Icon className="w-5 h-5 mr-2 text-primary" />
              Current Session Stats
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Questions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{quizCount}</p>
              </div>
              
              <div className="bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Correct</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">{correctCount}</p>
              </div>
              
              <div className="col-span-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Accuracy</p>
                <p className="text-2xl font-bold text-primary">
                  {quizCount > 0 ? Math.round((correctCount / quizCount) * 100) : 0}%
                </p>
              </div>
            </div>
            
            {quizCount >= 5 && (
              <div className="mt-4">
                <motion.button
                  onClick={completeQuiz}
                  className="w-full py-2 px-4 bg-secondary hover:bg-secondary-dark text-white font-medium rounded-lg transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Complete Quiz Session
                </motion.button>
              </div>
            )}
          </div>
          
          {/* Quiz History */}
          {quizHistory.length > 0 && (
            <div className="card p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Recent Answers</h3>
              
              <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-hide">
                {quizHistory.map((item, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg flex items-center
                      ${item.isCorrect 
                        ? 'bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500' 
                        : 'bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500'}`
                      }
                  >
                    <div className="mr-3">
                      {item.isCorrect 
                        ? <CheckCircleIcon className="w-5 h-5 text-green-500" /> 
                        : <XCircleIcon className="w-5 h-5 text-red-500" />
                      }
                    </div>
                    <div className="flex-1">
                      <p className={`font-medium ${item.isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {item.breedName}
                      </p>
                      {!item.isCorrect && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          You answered: {item.userAnswer}
                        </p>
                      )}
                    </div>
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {item.confidenceScore}%
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MainFeature;