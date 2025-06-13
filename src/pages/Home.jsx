import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ApperIcon from '../components/ApperIcon';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-secondary/5 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl w-full text-center"
      >
        <div className="bg-white rounded-lg shadow-xl p-8 md:p-12">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ApperIcon name="Building" className="w-8 h-8 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4"
          >
            Welcome to DeskFlow Pro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg text-gray-600 mb-8"
          >
            Your comprehensive hotel management system designed for front desk excellence. 
            Streamline check-ins, manage rooms, and deliver exceptional guest experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <div className="p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Calendar" className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Reservations</h3>
              <p className="text-sm text-gray-600">Manage bookings efficiently</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Bed" className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Room Status</h3>
              <p className="text-sm text-gray-600">Real-time availability</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <ApperIcon name="Users" className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Guest Services</h3>
              <p className="text-sm text-gray-600">Complete guest management</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="space-y-4"
          >
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full md:w-auto px-8 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
            <p className="text-sm text-gray-500">
              Ready to manage your hotel operations with ease
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;