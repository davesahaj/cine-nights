import "./App.css";
import UploadVideo from "./components/UploadVideo";
import Room from "./components/Room/Room";
import { Route, Routes } from "react-router-dom";

import { socket } from "./common/socket";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    return () => {
      socket.close();
    };
  }, []);

  return (
    <>
      <Routes>
        <Route path="/upload" element={<UploadVideo />} />
        <Route path="/room/:roomid" element={<Room />} />
      </Routes>
    </>
  );
}

export default App;
