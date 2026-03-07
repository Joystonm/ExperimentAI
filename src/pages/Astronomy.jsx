import React from 'react';
import { motion } from 'framer-motion';
import AstronomyLab from '../components/AstronomyLab';

const Astronomy = () => {
  return (
    <motion.div
      className="h-screen bg-gray-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <AstronomyLab />
    </motion.div>
  );
};

export default Astronomy;
