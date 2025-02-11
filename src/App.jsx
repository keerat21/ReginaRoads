import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import SimpleMap from "./components/SimpleMap/SimpleMap";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <SimpleMap />
    </>
  );
}

export default App;
