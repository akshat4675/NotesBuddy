// src/App.tsx
import React from "react";
import S3Upload from "./components/S3Upload";
import "./App.css";

const App: React.FC = () => {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload to S3</h1>
      <S3Upload />
    </div>
  );
};

export default App;
