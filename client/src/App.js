import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [renderedResponse, setRenderedResponse] = useState('');

  const getResponse = async () => {
    const response = await fetch('/api/hello')
    const body = await response.json()
    if (response.status !== 200) throw Error(body.message)

    return body;
  };

  useEffect(() => {
    getResponse()
      .then(res => {
        console.log(res)
        setRenderedResponse(res.express);
      })
  }, []);

  return (
    <div className="App">
      <p>{renderedResponse}</p>
    </div>
  );
}

export default App;
