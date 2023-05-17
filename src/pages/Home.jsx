import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import "./style.css";
import { useParams } from "react-router-dom";
import { HttpURL, Api } from "../utils.js";
import { Modal, Button } from "react-bootstrap";
import ShareButton from "react-social-share-buttons";
import initialData from "../data.json";

const Home = () => {
  const inputRefs = useRef([]);
  const [todayTopicData, setTodayTopicData] = useState({
    topic: "",
    items: [],
    values: [],
  });
  const [keyboardIdx, setKeyboardIdx] = useState(0);

  const [isBtnClickable, setIsBtnClickable] = useState(true);
  const [count, setCount] = useState(90.0);
  const [visibleItems, setVisibleItems] = useState(1);

  const { topicTitleParam } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const handleClose = () => setModalShow(false);

  //get the radom records from array
  const getRandomRecords = (arr, num) => {
    const result = [];
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * arr.length);
      result.push(arr[randomIndex]);
      arr.splice(randomIndex, 1);
    }
    return result;
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

    console.log(todayTopicData);

    e.target.setAttribute("disabled", true);

    setKeyboardIdx(keyboardIdx + 1);
    e.target.setAttribute("disabled", true);

    setKeyboardIdx(keyboardIdx + 1);
  };


  const [rankedItems, setRankedItems] = useState([]);
  //confrom today
  useEffect(() => {
    // Get today's date in ISO format without the time component
    const today = new Date().toISOString().substring(0, 10);

    // Get the stored date from local storage
    const storedDate = localStorage.getItem("lastSubmitDate");

    // Check if the stored date is equal to today's date
    if (storedDate === today) {
      console.log("oops", today);
      setIsBtnClickable(false);
    } else {
      setIsBtnClickable(true);
      // localStorage.setItem('lastSubmitDate', today);
    }
  }, []);

  // Enable/disable the button based on whether it has been clicked today and whether we're within the 90-second window
  useEffect(() => {
    const timerId = setTimeout(() => {
      const today = new Date().toISOString().substring(0, 10);
      setIsBtnClickable(false);
      localStorage.setItem("lastSubmitDate", today);
    }, 90000);

    return () => clearTimeout(timerId);
  }, [isBtnClickable]);

  useEffect(() => {
    let timerId;
    if (isBtnClickable) {
      let time = 0;

      timerId = setInterval(() => {
        if (count > 0) {
          setCount((count) => count - 0.1);
        }
      }, 100);
    }
    return () => clearInterval(timerId);
  }, [count]); // add count as a dependency

  useEffect(() => {

    if (topicTitleParam) {
          setTodayTopicData({
            ...todayTopicData,
            topic: topicTitleParam,
            items: getRandomRecords(initialData[topicTitleParam], 5),
          });
        } else {
          const topics = Object.keys(initialData);
          const randomTopic = topics[Math.floor(Math.random() * topics.length)];
          setTodayTopicData({
            ...todayTopicData,
            topic: randomTopic,
            items: getRandomRecords(initialData[randomTopic], 5),
          });
        }
    
    // return () => Api.get(HttpURL)
    //   .then((res) => {
        

    //     console.log("Data fetched:", initialData);
    //   })
    //   .catch((error) => console.log("Error saving data:", error));
  }, []);

  useEffect(() => {
    if (keyboardIdx === 5) {
      console.log(todayTopicData);

      const temp = todayTopicData.items;

      setRankedItems(temp.sort(
        (a, b) =>
          todayTopicData.values[todayTopicData.items.indexOf(a)] -
          todayTopicData.values[todayTopicData.items.indexOf(b)]
      ));

      const today = new Date().toISOString().substring(0, 10);
      localStorage.setItem("lastSubmitDate", today);
      setIsBtnClickable(false); 
      setModalShow(true);
    }
  }, [keyboardIdx]);

  return (
    <section>
      <Container fluid className="home-container">
        <div className="col-md-6 col-xxl-4 col-xl-4 col-sm-12 col-xs-12 offset-xl-4 offset-md-3 offset-xxl-4">
          <Row className="header mb-3">
            <p>
              Maazle <b className="green">Game</b>{" "}
              <small className="gray">#438</small>
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
          {todayTopicData.items ? (
            <Row className="foods mb-3">
              {Object.keys(todayTopicData.items)
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
            <h2>I have jsust completed Blindly</h2>
            <h4>Topic: {todayTopicData.topic}</h4>
            <h4>In {(90 - count).toFixed(1)} second</h4>
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
              {rankedItems.map((item) => <li>{item}</li>)}
            </ol>
            <div className="col-4 offset-4">
              <ShareButton
                compact
                socialMedia={"twitter"}
                url={"https://maaz-net.netlify.app"}
                text={"I have jsust completed Blindly" + "Topic:" + todayTopicData.topic + "In " + (90 - count).toFixed(1) + " second"}
                hashtags={"Blindlee"}
              />
            </div>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  );
};

export default Home;
