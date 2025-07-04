import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LoadingBar from '../LoadingBar/LoadingBar';

interface RouteTransitionProps {
  children: React.ReactNode;
}

const RouteTransition: React.FC<RouteTransitionProps> = ({ children }) => {
  const location = useLocation();
  const [showLoadingBar, setShowLoadingBar] = React.useState(false);

  useEffect(() => {
    setShowLoadingBar(true);
    const timer = setTimeout(() => {
      setShowLoadingBar(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {showLoadingBar && <LoadingBar />}
      {children}
    </>
  );
};

export default RouteTransition; 