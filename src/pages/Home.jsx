import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import ShareButton from "react-social-share-buttons";
import initialData from "../data.json";
import random, { Random } from "random";

import "./style.css";

const Home = () => {
  const inputRefs = useRef([]);
  const [todayTopicData, setTodayTopicData] = useState({
    topic: "",
    items: [],
    values: [],
  });
  const [keyboardIdx, setKeyboardIdx] = useState(0);

  const [isBtnClickable, setIsBtnClickable] = useState(true);
  const [count, setCount] = useState(30.0);
  const [visibleItems, setVisibleItems] = useState(1);

  const { topicTitleParam } = useParams();

  const [modalShow, setModalShow] = useState(false);

  const colors = ["primary", "success", "danger", "warning", "info"];

  const [isIntroModalShow, setIsIntroModalShow] = useState(true);
  const [resultData, setResultData] = useState({
    topic: "",
    items: [],
    values: [],
  });
  // const [resultData, setResultData] = useState([]);
  const handleIntroStart = () => {
    setIsIntroModalShow(false);
  };
  const handleClose = () => setModalShow(false);

  const emojie = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣']

  //get the radom records from array
  const getRandomRecords = (arr, num, seed) => {
    const randomItems = arr.sort(() => seed - Math.random()).slice(0, num);
    return randomItems;
  };

  const handleKeyBoardPress = (e) => {
    e.preventDefault();
    const num = parseInt(e.target.value);

    if (num == null || todayTopicData.values.includes(num)) {
      return;
    }

    setVisibleItems((prevVisibleItems) => prevVisibleItems + 1);
    const newValue = e.target.value;

    setTodayTopicData((prevData) => ({
      ...prevData,
      values: [...prevData.values, newValue],
    }));

    e.target.setAttribute("disabled", true);

    setKeyboardIdx(keyboardIdx + 1);
    e.target.setAttribute("disabled", true);

    setKeyboardIdx(keyboardIdx + 1);
  };

  //confrom today
  useEffect(() => {
    // Get today's date in ISO format without the time component
    const today = new Date().toISOString().substring(0, 10);
    // Get the stored date from local storage
    const storedDate = localStorage.getItem("lastSubmitDate");

    // Check if the stored date is equal to today's date
    if (storedDate === today) {
      setIsBtnClickable(false);
      setIsIntroModalShow(false);
      setModalShow(true);
      setResultData(JSON.parse(localStorage.getItem("resultData")));
    } else {
      localStorage.removeItem("todayTopic");
      setIsBtnClickable(true);
      setIsIntroModalShow(true);
    }
  }, []);

  // Enable/disable the button based on whether it has been clicked today and whether we're within the 30-second window
  useEffect(() => {
    if (!isIntroModalShow && isBtnClickable) {
      const timerId = setTimeout(() => {
        const today = new Date().toISOString().substring(0, 10);
        setIsBtnClickable(false);
        localStorage.setItem("lastSubmitDate", today);
      }, 30000);
      return () => clearTimeout(timerId);
    }
  }, [isIntroModalShow, isBtnClickable]);

  useEffect(() => {
    let timerId;
    if (!isIntroModalShow && isBtnClickable) {
      timerId = setInterval(() => {
        if (count > 0) {
          setCount((count) => count - 0.1);
        }
      }, 100);
    }
    return () => clearInterval(timerId);
  }, [isBtnClickable, isIntroModalShow]); // add count as a dependency

  useEffect(() => {
    const seed = new Date().getDate();
    if (topicTitleParam) {
      setTodayTopicData({
        ...todayTopicData,
        topic: topicTitleParam,
        items: getRandomRecords(initialData[topicTitleParam], 5, seed),
      });
    } else {
      const localTopic = JSON.parse(localStorage.getItem("todayTopic"));
      if (localTopic) {
        setTodayTopicData(localTopic);
      } else {
        const today = new Date();
        const randomKey =
          parseInt(today.getMonth()) + parseInt(today.getDate());
        const topics = Object.keys(initialData);
        const randomTopic = topics[randomKey % topics.length];
        const randomItems = getRandomRecords(initialData[randomTopic], 5, seed);
        const todayTopicData = {
          topic: randomTopic,
          items: randomItems,
          values: [],
        };
        setTodayTopicData(todayTopicData);
        localStorage.setItem("todayTopic", JSON.stringify(todayTopicData));
      }
    }
  }, []);

  useEffect(() => {
    if (keyboardIdx === 5) {
      localStorage.setItem("todayTopic", JSON.stringify(todayTopicData));
      const resultData = todayTopicData;
      resultData.items.sort(
        (a, b) =>
          resultData.values[resultData.items.indexOf(a)] -
          resultData.values[resultData.items.indexOf(b)]
      );
      resultData.values.sort((a, b) => a - b);
      setResultData(resultData);
      localStorage.setItem("resultData", JSON.stringify(resultData));
      const today = new Date().toISOString().substring(0, 10);
      localStorage.setItem("lastSubmitDate", today);
      setIsBtnClickable(false);
      setModalShow(true);

      const streak = localStorage.getItem("maxStreak");
      if (streak) {
        localStorage.setItem("maxStreak", parseInt(streak) + 1);
      } else {
        localStorage.setItem("maxStreak", 1);
      }
    }
  }, [keyboardIdx]);

  return (
    <section>
      <Container fluid className="home-container">
        <div className="col-md-6 col-xxl-4 col-xl-4 col-sm-12 col-xs-12 offset-xl-4 offset-md-3 offset-xxl-4">
          <Row className="header mb-3">
            <p>
              Maazle <b className="green">Game</b>
            </p>
            <h4>
              Today topic is{" "}
              <b className="yellow topic">{todayTopicData.topic}</b>
            </h4>
            {isBtnClickable ? (
              <h1>
                {count.toFixed(1)}
                <span>s left</span>
              </h1>
            ) : (
              <h2 style={{ color: "#FC7300", fontWeight: 600 }}>Game over</h2>
            )}
          </Row>
          {todayTopicData.values ? (
            <Row className="foods mb-3">
              {isBtnClickable
                ? Object.keys(todayTopicData.items)
                    .slice(0, visibleItems)
                    .map((item, index) => (
                      <div
                        className="d-flex flex-direction-row justify-content-between"
                        key={item}
                      >
                        <div className="food-item col-8">
                          <p>{todayTopicData.items[item]}</p>
                        </div>
                        <div
                          className="input-num col-2"
                          contentEditable={false}
                          // onKeyDown={(e) => handleKeyDown(e, index)}
                          ref={(el) => (inputRefs.current[index] = el)}
                          dangerouslySetInnerHTML={{
                            __html: todayTopicData.values[index],
                          }}
                        />
                      </div>
                    ))
                : Object.keys(
                    JSON.parse(localStorage.getItem("todayTopic")).items
                  ).map((item, index) => (
                    <div
                      className="d-flex flex-direction-row justify-content-between"
                      key={item}
                    >
                      <div className="food-item col-8">
                        <p>
                          {
                            JSON.parse(localStorage.getItem("todayTopic"))
                              .items[item]
                          }
                        </p>
                      </div>
                      <div
                        className="input-num col-2"
                        contentEditable={false}
                        // onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        dangerouslySetInnerHTML={{
                          __html: JSON.parse(localStorage.getItem("todayTopic"))
                            .values[index],
                        }}
                      />
                    </div>
                  ))}
            </Row>
          ) : (
            <p className="loading">Loading...</p>
          )}
          <Row className="d-flex justify-content-evenly mb-5 keyboard">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={value}
                disabled={!isBtnClickable}
              >
                {value}
              </button>
            ))}
          </Row>
        </div>

        <Modal
          show={modalShow}
          onHide={handleClose}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          style={{ textAlign: "center" }}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Show your result
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="col-8 offset-2 d-flex flex-row justify-content-around mb-3">
              <div>
                <p>Current streak</p>
                <h3>1</h3>
              </div>
              <div>
                <p>Max streak</p>
                <h3>{localStorage.getItem("maxStreak")}</h3>
              </div>
            </div>
            <h2>I have just completed Blindly</h2>
            {localStorage.getItem("resultData") && (
              <>
                <h4>Topic: {resultData.topic}</h4>
                <h4>In {(30 - count).toFixed(1)} seconds</h4>
                <ol
                  className="col-xl-6 offset-xl-3 col-md-8 offset-md-2 col-sm-12"
                  style={{
                    textAlign: "justify",
                    margin: "auto",
                    fontSize: 22,
                    wordBreak: "break-all",
                    marginBottom: 20,
                  }}
                >
                  {resultData.items.map((item, index) => (
                    <li key={index}>
                      {item}{" "}
                      <span
                        
                      >
                        {emojie[6 - resultData.values[index]-1]}
                      </span>
                    </li>
                  ))}
                </ol>
                <div className="col-4 offset-4">
                  <ShareButton
                    compact
                    socialMedia={"twitter"}
                    url={"https://maaz-net.netlify.app"}
                    text={`I have jsust completed Blindly.%0aTopic: ${
                      todayTopicData.topic
                    }%0aIn ${(30 - count).toFixed(1)}seconds%0a${resultData.items
                      .map((item, index) => `${index + 1}. ${item} ${emojie[5-index-1]}%0a`)
                      .join("")}`}
                  />
                </div>
              </>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={isIntroModalShow}
          onHide={handleIntroStart}
          aria-labelledby="contained-modal-title-vcenter"
          centered
          className="introduction"
        >
          <Modal.Body>
            <div className="mb-4">
              <h1 style={{ fontSize: "300%", margin: "20px" }}>Welcome!</h1>
              <h4>Topic: {todayTopicData.topic}</h4>
            </div>
            <Button
              onClick={handleIntroStart}
              style={{
                fontSize: "150%",
                padding: "10px 50px",
                marginBottom: "20px",
              }}
            >
              Start
            </Button>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  );
};

export default Home;
