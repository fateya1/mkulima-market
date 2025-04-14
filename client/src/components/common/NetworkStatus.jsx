import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
// import { setNetworkStatus } from "../../store/slices/uiSLice";
import { synchronizeData } from "../../services/offlineSync";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      dispatch(setNetworkStatus(true));
      synchronizeData(); // Sync data when back online
    };

    const handleOffline = () => {
      setIsOnline(false);
      dispatch(setNetworkStatus(false));
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return null; // This component doesn't render anything, just monitors network status
};

export default NetworkStatus;
