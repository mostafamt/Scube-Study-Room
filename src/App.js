import React, { useEffect, useState } from "react";
import "./App.css";
import Videoall from "./components/videoComponent/videoRow";
import useAuth from "./hooks/useAuth";

// import Footer from "./components/HeaderAndFooter/Footer";

const App = (props) => {
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [videoSource] = useState("");
  const auth = useAuth();
  useEffect(() => {
    if (auth) {
      setAuthenticated(true);
    }
  }, [auth]);

  if (!isAuthenticated) {
    return <div></div>;
  }
  return <Videoall videoSource={videoSource} />;
};

export default App;
