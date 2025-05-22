import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const AlertCircleIcon = getIcon('alert-circle');
const HomeIcon = getIcon('home');

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12">
      <motion.div 
        className="text-center max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-block p-4 bg-red-100 dark:bg-red-900/30 rounded-full mb-6">
          <AlertCircleIcon className="w-12 h-12 text-red-500 dark:text-red-400" />
        </div>
        
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Page Not Found</h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          We couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg transition-colors"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
        </motion.div>
        
        <div className="mt-12">
          <img 
            src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400" 
            alt="Sad dog" 
            className="mx-auto h-64 object-cover rounded-lg shadow-lg"
          />
          <p className="mt-4 text-gray-500 dark:text-gray-400 text-sm italic">
            Even our dog friend is sad we couldn't find that page!
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;