import React, { useState, useEffect, useRef } from "react";
import { Container, Row } from "react-bootstrap";
import "./style.css";
import { useNavigate, useParams } from "react-router-dom";
import { HttpURL, Api } from "../utils.js";

const Home = () => {
  const [values, setValues] = useState([]);
  const inputRefs = useRef([]);
  const submitRef = useRef(null);
  const [jsonData, setJsonData] = useState({ items: {} });
  const [keyboardIdx, setKeyboardIdx] = useState(0);

  const [isBtnClickable, setIsBtnClickable] = useState(true);
  const [count, setCount] = useState(90);
  const navigate = useNavigate();

  const { topicTitle } = useParams();

  const getNumFromKeyCode = (keyCode) => {
    switch (keyCode) {
      case 97:
      case 49:
        return 1;
      case 98:
      case 50:
        return 2;
      case 99:
      case 51:
        return 3;
      case 100:
      case 52:
        return 4;
      case 101:
      case 53:
        return 5;
      default:
        return null;
    }
  };

  const handleKeyDown = (e, index) => {
    const keyCode = e.keyCode || e.which;
    const num = getNumFromKeyCode(keyCode);

    if (num == null || values.includes(num)) {
      e.preventDefault();
      return;
    }

    setValues((prevValues) => [...prevValues, num]);
    let keyboardItems = document.getElementsByClassName("keyboard-item");
    keyboardItems[num - 1].setAttribute("disabled", true);
    if (index === Object.keys(jsonData.items).length - 1) {
      submitRef.current.focus();
      inputRefs.current[index].classList.remove("active");
      inputRefs.current[index].setAttribute("contentEditable", false);
    } else {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        e.preventDefault();
        inputRefs.current[index].setAttribute("contentEditable", false);
        inputRefs.current[index].classList.remove("active");
        nextInput.classList.add("active");
        nextInput.setAttribute("contentEditable", true);
        nextInput.focus();
      }
    }

    setKeyboardIdx(keyboardIdx + 1);
  };

  const handleKeyBoardPress = (e) => {
    e.preventDefault();
    setValues((prevValues) => [...prevValues, e.target.value]);

    e.target.setAttribute("disabled", true);
    if (keyboardIdx === Object.keys(jsonData.items).length - 1) {
      submitRef.current.focus();
      inputRefs.current[keyboardIdx].classList.remove("active");
      return;
    }
    const nextInput = inputRefs.current[keyboardIdx + 1];
    if (nextInput) {
      inputRefs.current[keyboardIdx].classList.remove("active");
      nextInput.classList.add("active");
      nextInput.focus();
    }
    setKeyboardIdx(keyboardIdx + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItems = jsonData.items;
    Object.keys(jsonData.items).forEach((item, index) => {
      const newValue = values[index] || 0;
      updatedItems[item].rank = jsonData.items[item].rank + parseInt(newValue);
    });
    const today = new Date().toISOString().substring(0, 10);
    localStorage.setItem("lastSubmitDate", today);
    setIsBtnClickable(false);

    Api.get(HttpURL)
      .then((res) => {
        // Get an array of topic values from the object
        const currentData = Object.values(res.data.record);
        const topicToUpdate = Object.keys(currentData).find(
          (key) => currentData[key].title === jsonData.title
        );
        if (topicToUpdate) {
          const updatedTopic = {
            ...currentData[topicToUpdate],
            items: jsonData.items,
          };
          const updatedJsonData = {
            ...currentData,
            [topicToUpdate]: updatedTopic,
          };
          Api.put(HttpURL, updatedJsonData)
            .then((res) => {
              navigate("/chart", { state: { passData: jsonData } });
              console.log("Updated: ", res.data.record);
            })
            .catch((err) => console.log("Error: ", err));
        }
      })
      .catch((error) => console.log("Error saving data:", error));

    // navigate("/chart");
  };

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
      timerId = setInterval(() => {
        if (count > 0) {
          setCount((count) => count - 1);
        }
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [isBtnClickable, count]); // add count as a dependency

  useEffect(() => {
    Api.get(HttpURL)
      .then((res) => {
        // Get an array of topic values from the object
        const topicValues = Object.values(res.data.record);

        if (topicTitle) {
          const getedTopic = Object.keys(topicValues).find(
            (key) => topicValues[key].title === topicTitle
          );
          setJsonData(topicValues[getedTopic]);
        } else {
          // Get a random index in the array
          const randomIndex = Math.floor(Math.random() * topicValues.length);
          // Use the random index to get a random topic from the array
          const randomTopic = topicValues[randomIndex];
          setJsonData(randomTopic);
        }

        console.log("Data fetched:", res.data.record);
      })
      .catch((error) => console.log("Error saving data:", error));
  }, []);

  useEffect(() => {
    // inputRefs.current[0]?.setAttribute("contentEditable", true);
    inputRefs.current[0]?.classList.add("active");
  }, [jsonData]);

  return (
    <section>
      <Container fluid className="home-container">
        <div className="col-md-6 col-xxl-4 col-xl-4 col-sm-12 col-xs-12 offset-xl-4 offset-md-3 offset-xxl-4">
          <form onSubmit={handleSubmit}>
            <Row className="header mb-5">
              <p>
                Maazle <b className="green">Game</b>{" "}
                <small className="gray">#438</small>
              </p>
              <h4>
                Today topic is <b className="yellow topic">{jsonData.title}</b>
              </h4>
              {isBtnClickable ? <h1>
                {count}
                <span>s left</span>
              </h1> : <h2 style={{ color: '#FC7300', fontWeight: 600}}>Game over</h2>}
            </Row>
            {jsonData.items ? (
              <Row className="foods mb-5">
                {Object.keys(jsonData.items).map((item, index) => (
                  <div
                    className="d-flex flex-direction-row justify-content-between"
                    key={item}
                  >
                    <div className="food-item col-8">
                      <p>{jsonData.items[item].title}</p>
                    </div>
                    <div
                      className="input-num col-2"
                      contentEditable={false}
                      // onKeyDown={(e) => handleKeyDown(e, index)}
                      ref={(el) => (inputRefs.current[index] = el)}
                      dangerouslySetInnerHTML={{ __html: values[index] }}
                    />
                  </div>
                ))}
              </Row>
            ) : (
              <p className="loading">Loading...</p>
            )}
            <Row className="d-flex justify-content-evenly mb-5 keyboard">
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={1}
                disabled={!isBtnClickable}
              >
                1
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={2}
                disabled={!isBtnClickable}
              >
                2
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={3}
                disabled={!isBtnClickable}
              >
                3
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={4}
                disabled={!isBtnClickable}
              >
                4
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={5}
                disabled={!isBtnClickable}
              >
                5
              </button>
            </Row>
            <Row>
              <button
                ref={submitRef}
                type="submit"
                className="view-chart"
                value="View Chart"
                disabled={!isBtnClickable}
              >
                View Chart
              </button>
            </Row>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Home;
