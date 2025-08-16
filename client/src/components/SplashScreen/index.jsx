import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { API_CONFIG } from '@/src/constants';

import {
  stylesSplashScreenBox,
  stylesSplashScreenDiv,
  stylesSplashScreenTypography,
} from '@/src/styles';

function SplashScreen() {
  const [startAnimation, setStartAnimation] = useState(false);
  const [showText, setShowText] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const timer1 = setTimeout(() => setStartAnimation(true), 500);
    const timer2 = setTimeout(() => setShowText(true), 1600);
    const timer3 = setTimeout(() => setProgress(100), 3000);
    const timer4 = setTimeout(() => setDone(true), 3500);

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

  const logoSize = useMemo(() => (isMobile ? 70 : 100), [isMobile]);
  const textWidth = useMemo(() => (isMobile ? 480 : 750), [isMobile]);
  const variant = useMemo(() => (isMobile ? 'h2' : 'h1'), [isMobile]);
  const barWidth = useMemo(() => (isMobile ? '80%' : '60%'), [isMobile]);

  const containerAnimate = useMemo(() => ({ opacity: done ? 0 : 1 }), [done]);

  const containerInitial = useMemo(() => ({ opacity: 1 }), []);

  const containerStyle = useMemo(
    () => ({
      pointerEvents: done ? 'none' : 'auto',
      position: 'fixed',
      inset: 0,
      willChange: 'opacity',
      zIndex: done ? -1 : 9999,
    }),
    [done]
  );

  const imageStyle = useMemo(
    () => ({
      width: logoSize,
      height: logoSize,
      objectFit: 'contain',
      willChange: 'transform',
    }),
    [logoSize]
  );

  const textWrapperStyle = useMemo(
    () => ({
      overflow: 'hidden',
      willChange: 'transform, opacity',
    }),
    []
  );

  const textAnimation = useMemo(() => {
    if (showText) {
      return { width: textWidth, opacity: 1, x: 0 };
    }
    return { width: 0, opacity: 0, x: 20 };
  }, [showText, textWidth]);

  const textInitial = useMemo(() => ({ width: 0, opacity: 0 }), []);

  const containerTransition = useMemo(
    () => ({ duration: 0.3, ease: 'easeInOut' }),
    []
  );

  const scaleTransition = useMemo(
    () => ({ duration: 1, ease: 'easeInOut' }),
    []
  );

  const textTransition = useMemo(
    () => ({ duration: 1.2, ease: 'easeOut' }),
    []
  );

  const barBoxStyle = useMemo(() => ({ width: barWidth, mt: 6 }), [barWidth]);

  const scaleAnimation = useMemo(
    () => (startAnimation ? { scale: 0.5, x: 0 } : { scale: 1, x: 0 }),
    [startAnimation]
  );

  return (
    <motion.div
      animate={containerAnimate}
      initial={containerInitial}
      style={containerStyle}
      transition={containerTransition}
    >
      <Box sx={stylesSplashScreenBox}>
        <motion.div
          animate={scaleAnimation}
          style={stylesSplashScreenDiv}
          transition={scaleTransition}
        >
          <motion.img
            alt='Logo'
            src={`${API_CONFIG.BASE_URL.replace('/api', '')}/images/logo.png`}
            style={imageStyle}
          />

          <motion.div
            animate={textAnimation}
            initial={textInitial}
            style={textWrapperStyle}
            transition={textTransition}
          >
            <Typography sx={stylesSplashScreenTypography} variant={variant}>
              Home Accounting
            </Typography>
          </motion.div>
        </motion.div>

        <Box sx={barBoxStyle}>
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
