import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { Api, HttpURL, SelectedDataHttpURL } from "../utils";
import { useLocation } from 'react-router-dom';
import { Chart } from "react-google-charts";

const MyChart = () => {
  // const [jsonData, setJsonData] = useState({ items: {} });
  const [chartData, setChartData] = useState([]);
  const location = useLocation();
  const data = location.state.passData; // accessing the passed data

  const initChartData = (data) => {
    let temp = 0;
    Object.keys(data.items).forEach((item) => {
      temp += data.items[item].rank;
    });
    const tempChartData = [["Title", "Like"]];
    Object.keys(data.items).forEach((item) => {
      tempChartData.push([
        data.items[item].title,
        parseInt((100 * data.items[item].rank) / temp),
      ]);
    });
    console.log(tempChartData);
    setChartData(tempChartData);
  };

  const options = {
    title: "Like chart",
    is3D: true,
    colors: ["#0077FF", "#FF7F50", "#008000", "#FFA07A", "#800080"],
    backgroundColor: "none",
    titleTextStyle: {
      color: "#fff", // set the title color
      fontSize: 38, // set the title font size
    },
    subtitle: false,
    legend: {
      textStyle: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
      },
    },
  };

  useEffect(() => {
        initChartData(data);
        console.log(data);
  }, []);

  return (
    <Container className="align-item-center chart-contaniter py-3">
      <Row>
        <Col md={8}>
          {chartData.length > 0 ? (
            <Chart
              chartType="ColumnChart"
              data={chartData}
              options={options}
              width={"100%"}
              height={"600px"}
            />
          ) : (
            <p className="loading mt-5">Loading...</p>
          )}
        </Col>
        <Col md={4} className="chart-action">
            <div className="chart-action-item"><b>Share your result!</b></div>
            <div className="chart-action-item">Copy your chart</div>
            <div className="chart-action-item">Copy link to this word</div>
            <div className="chart-action-item">Downlaod chart image</div>
        </Col>
      </Row>
    </Container>
  );
};

export default MyChart;
