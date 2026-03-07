import React from 'react';
import { motion } from 'framer-motion';
import ElectricalPlayground from '../components/ElectricalPlayground';

const Playground = () => {
  return (
    <motion.div
      className="h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ElectricalPlayground />
    </motion.div>
  );
};

export default Playground;
