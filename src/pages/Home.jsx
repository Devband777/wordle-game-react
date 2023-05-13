import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { HttpURL, Api, SelectedDataHttpURL } from "../utils.js";

const Home = () => {
  const [values, setValues] = useState([]);
  const inputRefs = useRef([]);
  const submitRef = useRef(null);
  const [jsonData, setJsonData] = useState({ items: {} });
  const [keyboardIdx, setKeyboardIdx] = useState(0);

  const navigate = useNavigate();

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
      inputRefs.current[keyboardIdx].setAttribute("contentEditable", false);
      return;
    }
    const nextInput = inputRefs.current[keyboardIdx + 1];
    if (nextInput) {
      inputRefs.current[keyboardIdx].setAttribute("contentEditable", false);
      inputRefs.current[keyboardIdx].classList.remove("active");
      nextInput.classList.add("active");
      nextInput.setAttribute("contentEditable", true);
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
    console.log(updatedItems);
    Api.put(SelectedDataHttpURL, { ...jsonData, items: updatedItems })
      .then((res) => console.log("Updated: ", res.data.record))
      .catch((err) => console.log("Error: ", err));
    navigate("/chart");
  };

  useEffect(() => {
    Api.get(HttpURL)
      .then((res) => {
        // Get an array of topic values from the object
        const topicValues = Object.values(res.data.record);

        // Get a random index in the array
        const randomIndex = Math.floor(Math.random() * topicValues.length);

        // Use the random index to get a random topic from the array
        const randomTopic = topicValues[randomIndex];
        setJsonData(randomTopic);
        console.log("Data fetched:", res.data.record);
      })
      .catch((error) => console.log("Error saving data:", error));
  }, []);

  useEffect(() => {
    inputRefs.current[0]?.setAttribute("contentEditable", true);
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
            </Row>
            {jsonData.items ? (
              <Row className="foods mb-5">
                {Object.keys(jsonData.items).map((item, index) => (
                  <div
                    className="d-flex flex-direction-row justify-content-between"
                    key={item}
                  >
                    <div className="food-item col-8">
                      {jsonData.items[item].title}
                    </div>
                    <div
                      className="input-num col-2"
                      contentEditable={false}
                      onKeyDown={(e) => handleKeyDown(e, index)}
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
              >
                1
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={2}
              >
                2
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={3}
              >
                3
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={4}
              >
                4
              </button>
              <button
                className="keyboard-item"
                onClick={(e) => handleKeyBoardPress(e)}
                value={5}
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
