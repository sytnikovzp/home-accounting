import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import { Box, LinearProgress, Typography } from '@mui/material';

import accountingLogo from '../../assets/logo.png';

function SplashScreen({ onFinish }) {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showText, setShowText] = useState(false);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer1 = setTimeout(() => setStartAnimation(true), 1000);
    const timer2 = setTimeout(() => setShowText(true), 1600);
    const timer3 = setTimeout(() => setProgress(100), 3400);
    const timer4 = setTimeout(() => setVisible(false), 3500);
    const timer5 = setTimeout(() => onFinish && onFinish(), 4000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 90 ? prev + 1 : prev));
    }, 40);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          exit={{ opacity: 0 }}
          initial={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              position: 'fixed',
              inset: 0,
              backgroundImage: 'linear-gradient(to bottom, #E8F5E9, #C8E6C9)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
            }}
          >
            <motion.div
              animate={
                startAnimation ? { scale: 0.5, x: 0 } : { scale: 1, x: 0 }
              }
              style={{ display: 'flex', alignItems: 'center' }}
              transition={{ duration: 1, ease: 'easeInOut' }}
            >
              <motion.img
                alt='Logo'
                src={accountingLogo}
                style={{
                  width: 100,
                  height: 100,
                  objectFit: 'contain',
                  borderRadius: 20,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                }}
              />

              <motion.div
                animate={
                  showText
                    ? { width: 750, opacity: 1, x: 0 }
                    : { width: 0, opacity: 0, x: 20 }
                }
                initial={{ width: 0, opacity: 0 }}
                style={{ overflow: 'hidden' }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              >
                <Typography
                  sx={{
                    ml: 2,
                    whiteSpace: 'nowrap',
                    fontWeight: 500,
                  }}
                  variant='h1'
                >
                  Home Accounting
                </Typography>
              </motion.div>
            </motion.div>

            <Box sx={{ width: '60%', mt: 6 }}>
              <LinearProgress
                color='success'
                value={progress}
                variant='determinate'
              />
            </Box>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SplashScreen;
