import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [renderedResponse, setRenderedResponse] = useState([]);
  const [imgCache, setImageCache] = useState([]);
  const [imgIndex, setImageIndex] = useState(0);
  const [breedList, setBreedList] = useState([]);
  const [breedId, setBreedId] = useState();
  const [fetchURL, setFetchURL] = useState(
    "https://api.thecatapi.com/v1/images/search"
  );

  const getResponse = async () => {
    const response = await fetch(fetchURL);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  const getBreedList = async () => {
    const response = await fetch("https://api.thecatapi.com/v1/breeds");
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);

    return body;
  };

  useEffect(() => {
    getResponse().then((res) => {
      setRenderedResponse(res);
      pushToCache(res[0]);
    });
    getBreedList().then((res) => {
      setBreedList(res);
    });
  }, []);

  useEffect(() => {
    if (breedId) {
      setFetchURL(
        `https://api.thecatapi.com/v1/images/search?breed_id=${breedId}`
      );
      getResponse()
      .then((res) => {
        setRenderedResponse(res);
        pushToCache(res[0]);
      })
    }
  }, [breedId]);

  function MainContent({ children }) {
    return <main>{children}</main>;
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
      .then((res) => {
        setRenderedResponse(res);
        pushToCache(res[0]);
      })
      .finally(() => {
        setImageIndex(imgCache.length);
      });
  }

  function handleBreedSelection(value) {
    setBreedId(value);
  }

  function Buttons() {
    const cache = imgCache;

    return (
      <>
        <div className="buttonsContainer">
          <button disabled={imgIndex == 0} onClick={handlePrev}>
            Prev
          </button>
          <button onClick={handleRand}>Random</button>
          <select
            onChange={(e) => {
              handleBreedSelection(e.target.value)
            }}
            name="breeds"
            id="breeds"
          >
            <option>Choose breed</option>
            <option value="beng">Bengals</option>
            <option value="awir">American Wirehairs</option>
          </select>
          <button disabled={imgIndex == cache.length - 1} onClick={handleNext}>
            Next
          </button>
        </div>
      </>
    );
  }

  function Response() {
    const { url, breeds } = imgCache[imgIndex];

    return (
      <div className="container">
        <div className="top">
          <figure className="imgContainer">
            <img src={url} alt="" />
          </figure>
          <dl>
            <dt>Breed:</dt>
            <dd>{breeds.length ? breeds[0].name : "no breed info"}</dd>
            <dt> Life Span:</dt>
            <dd>
              {breeds.length
                ? breeds[0].life_span + " years"
                : "no life span info"}
            </dd>
            <dt>Url:</dt>
            <dd>
              <a href={url} target="_blank" rel="noreferrer noopener">
                {url}
              </a>
            </dd>
          </dl>
        </div>
        <Buttons />
      </div>
    );
  }

  return (
    <div className="App">
      <MainContent>
        {renderedResponse && renderedResponse[0] && imgCache.length > 0 && (
          <Response />
        )}
      </MainContent>
    </div>
  );
}

export default App;
