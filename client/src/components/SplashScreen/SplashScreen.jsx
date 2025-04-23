import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import accountingLogo from '../../assets/logo.png';

function SplashScreen() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setStartAnimation(true), 300);
    const timer2 = setTimeout(() => setShowText(true), 1300);
    const timer3 = setTimeout(() => setProgress(100), 2500);
    const timer4 = setTimeout(() => setDone(true), 3000);

    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 1 : prev));
    }, 20);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <motion.div
      animate={{ opacity: done ? 0 : 1 }}
      initial={{ opacity: 1 }}
      style={{
        pointerEvents: done ? 'none' : 'auto',
        position: 'fixed',
        inset: 0,
        zIndex: done ? -1 : 9999,
      }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          backgroundImage: 'linear-gradient(to bottom, #E8F5E9, #C8E6C9)',
        }}
      >
        <motion.div
          animate={startAnimation ? { scale: 0.5, x: 0 } : { scale: 1, x: 0 }}
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
              sx={{ ml: 2, whiteSpace: 'nowrap', fontWeight: 500 }}
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
  );
}

export default SplashScreen;
