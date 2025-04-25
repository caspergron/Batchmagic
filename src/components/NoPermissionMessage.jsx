import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import './NoPermissionMessage.css';

const NoPermissionMessage = () => {
    return (
        <div className="no-permission-container">
            <motion.div
                className="no-permission-content"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <motion.div
                    className="lock-icon"
                    animate={{
                        rotate: [0, -10, 10, -10, 10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 1,
                        times: [0, 0.2, 0.4, 0.6, 0.8, 1],
                        repeat: Infinity,
                        repeatDelay: 2
                    }}
                >
                    🔒
                </motion.div>

                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    Access Restricted
                </motion.h2>

                <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="message"
                >
                    You donot have permission to access this feature.
                    Please contact your administrator for access.
                </motion.p>

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <Link to="/dashboard" className="back-button">
                        Back to Dashboard
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NoPermissionMessage;