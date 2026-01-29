// import React from "react";
import Survey from "./pages/Survey";
import { Footer } from "./Components/Footer";
import Navbar from "./Components/Navbar";

const App = () => {
  return (
    // Adds bottom padding so fixed footer does not overlap the survey content.
    <div className="bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 min-h-screen pb-28">
      <Navbar />
      <Survey />
      <Footer />
    </div>
  );
};

export default App;
