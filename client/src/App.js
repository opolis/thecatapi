import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [renderedResponse, setRenderedResponse] = useState([])
  const [imgCache, setImageCache] = useState([]);
  const [imgIndex, setImageIndex] = useState(0);
  const fetchURL = "https://api.thecatapi.com/v1/images/search";

  const getResponse = async () => {
    const response = await fetch(fetchURL);
    const body = await response.json()
    if (response.status !== 200) throw Error(body.message)

    return body;
  };

  useEffect(() => {
    getResponse()
      .then(res => {
        setRenderedResponse(res);
        pushToCache(res[0]);
      })
  }, []);

  function MainContent({ children }) {
    return (
      <main>{children}</main>
    )
  }

  function handlePrev() {
    setImageIndex(imgIndex - 1);
  }

  function handleNext() {
    setImageIndex(imgIndex + 1);
  }

  function pushToCache(obj) {
    setImageCache([...imgCache, obj]);
  }

  function handleRand() {
    getResponse()
      .then(res => {
        setRenderedResponse(res);
        pushToCache(res[0]);
      }).finally(() => {
        setImageIndex(imgCache.length);
      })
  }

  function Buttons() {
    const cache = imgCache;

    return (
      <div className="buttonsContainer">
        <button disabled={imgIndex == 0} onClick={handlePrev}>Prev</button>
        <button onClick={handleRand}>Random</button>
        <button disabled={imgIndex == cache.length - 1} onClick={handleNext}>Next</button>
      </div>
    )
  }

  function Response() {
    const { url, breed, lifeSpan } = imgCache[imgIndex];

    return (
      <div className="container">
        <div className="top">
          <figure className="imgContainer">
            <img src={url} alt="" />
          </figure>
          <dl>
            <dt>Breed:</dt>
            <dd>{breed}</dd>
            <dt> Life Span:</dt>
            <dd>{lifeSpan}</dd>
            <dt>Url:</dt>
            <dd>{url}</dd>
          </dl>
        </div>
        <Buttons />
      </div >
    )
  }

  return (
    <div className="App">
      <MainContent>
        {renderedResponse && renderedResponse[0] && imgCache.length > 0 && <Response />}
      </MainContent>
    </div>
  );
}

export default App;
