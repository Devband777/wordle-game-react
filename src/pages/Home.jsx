import React, { useState, useEffect, useRef } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { HttpURL, Api, SelectedDataHttpURL } from "../utils.js";
// import jsonData from "../data.json";
// import axios from "axios";

const Home = () => {
  const [values, setValues] = useState({});
  const inputRefs = useRef([]);
  const submitRef = useRef(null);
  const [jsonData, setJsonData] = useState({ items: {} });
  const [idx, setIdx] = useState(0);

  const navigate = useNavigate();

  const handleKeyDown = (e, index) => {
    
    const keyCode = e.keyCode || e.which;
    if (keyCode < 49 || keyCode > 53) {
      e.preventDefault();
      return;
    }
    const num = String.fromCharCode(keyCode);
    setValues({ ...values, [index]: num });
    let keyboardItems = document.getElementsByClassName('keyboard-item');
    // console.log(num);
    keyboardItems[num-1].setAttribute("disabled", true);
    if (index === Object.keys(jsonData.items).length - 1) {
      submitRef.current.focus();
      inputRefs.current[index].classList.remove("active");
      inputRefs.current[index].setAttribute("contentEditable", false);
    } else {
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        inputRefs.current[index].setAttribute("contentEditable", false);
        inputRefs.current[index].classList.remove("active");
        nextInput.classList.add("active");
        nextInput.setAttribute("contentEditable", true);
        nextInput.focus();
      }
    }
  };

  const handleKeyBoardPress = (e) => {
    e.preventDefault();
    setValues({ ...values, [idx]: e.target.value });
    
    e.target.setAttribute("disabled", true)
    if (idx === Object.keys(jsonData.items).length - 1) {
      submitRef.current.focus();
      inputRefs.current[idx].classList.remove("active");
      inputRefs.current[idx].setAttribute("contentEditable", false);
      return;
    } 
      const nextInput = inputRefs.current[idx + 1];
      if (nextInput) {
        inputRefs.current[idx].setAttribute("contentEditable", false);
        inputRefs.current[idx].classList.remove("active");
        nextInput.classList.add("active");
        nextInput.setAttribute("contentEditable", true);
        nextInput.focus();
      }
      setIdx(idx+1);
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedItems = jsonData.items;
    Object.keys(jsonData.items).forEach((item, index) => {
      const newValue = values[index] || 0;
      updatedItems[item].rank = jsonData.items[item].rank + parseInt(newValue);
    });
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

  useEffect(()=> {
    inputRefs.current[0]?.setAttribute("contentEditable", true);
    inputRefs.current[0]?.classList.add("active");
  }, [jsonData])
  
  return (
    <section>
      <Container fluid className="home-container">
        <div className="col-md-8 col-xxl-6 col-xl-6 col-sm-12 col-xs-12 offset-xl-3 offset-md-2 offset-xxl-3">
          <form onSubmit={handleSubmit}>
            <Row className="header mb-5">
              <p>
                Maazle <span className="green">Game</span>{" "}
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
                    <Col xl={8} md={8} sm={8} xs={8}>
                      <div className="food-item">
                        {jsonData.items[item].title}
                      </div>
                    </Col>
                    <Col xl={2} md={2} sm={2} xs={2}>
                      <div
                        className="input-num"
                        contentEditable={false}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        ref={(el) => (inputRefs.current[index] = el)}
                        dangerouslySetInnerHTML={{ __html: values[index] }}
                      />
                    </Col>
                  </div>
                ))}
              </Row>
            ) : (
              <p className="loading">Loading...</p>
            )}
            <Row className="d-flex justify-content-evenly mb-5 keyboard">
              <button className="keyboard-item" onClick={(e) => handleKeyBoardPress(e)} value={1}>1</button >
              <button className="keyboard-item" onClick={(e) => handleKeyBoardPress(e)} value={2}>2</button >
              <button className="keyboard-item" onClick={(e) => handleKeyBoardPress(e)} value={3}>3</button >
              <button className="keyboard-item" onClick={(e) => handleKeyBoardPress(e)} value={4}>4</button >
              <button className="keyboard-item" onClick={(e) => handleKeyBoardPress(e)} value={5}>5</button >
            </Row>
            <Row>
              <Col md={6} xl={6}>
                <input
                  ref={submitRef}
                  type="submit"
                  className="view-chart"
                  value="View Chart"
                />
              </Col>
            </Row>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Home;
