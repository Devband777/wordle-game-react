import React, { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { HttpURL, Api, TodayTopic, SelectedDataHttpURL } from "../utils.js";
// import jsonData from "../data.json";
// import axios from "axios";

const Home = () => {
  const [values, setValues] = useState({});

  const [jsonData, setJsonData] = useState({ items: {} });

  const navigate = useNavigate();

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

  const handleChange = (e, key) => {
    const newValue = e.target.value;
    if (/^\d+$/.test(newValue) && newValue >= 1 && newValue <= 5) {
      setValues({ ...values, [key]: newValue });
    } else {
      setValues({ ...values, [key]: 0 });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedItems = jsonData.items;
    Object.keys(jsonData.items).forEach((item) => {
      const newValue = values[item] || 0;
      updatedItems[item].rank = jsonData.items[item].rank + parseInt(newValue);
    });
    console.log(updatedItems);
    Api.put(SelectedDataHttpURL, { ...jsonData, items: updatedItems })
      .then((res) => console.log("Updated: ", res.data.record))
      .catch((err) => console.log("Error: ", err));
    navigate("/chart");
  };
  return (
    <section>
      <Container fluid className="home-container col-md-6">
        <Row className="header">
          <p>
            Maazle <span className="green">Game</span>{" "}
            <small className="gray">#438</small>
          </p>
          <h4>
            Today topic is <b className="yellow topic">{jsonData.title}</b>
          </h4>
        </Row>
        <form onSubmit={handleSubmit}>
          {jsonData.items ? (
            <Row className="foods col-md-8 offset-2 mb-4">
              {Object.keys(jsonData.items).map((item) => (
                <div className="food-item">
                  <div>{jsonData.items[item].title}</div>
                  <input
                    type="text"
                    value={values[item] || ""}
                    onChange={(e) => handleChange(e, item)}
                  />
                </div>
              ))}
            </Row>
          ) : (
            <p className="loading">Loading...</p>
          )}
          <Row className="col-md-6 offset-3">
            <input type="submit" className="view-chart" value="View Chart" />
          </Row>
        </form>
      </Container>
    </section>
  );
};

export default Home;
