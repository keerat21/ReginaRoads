import { useState } from "react";
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
