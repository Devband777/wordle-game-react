import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";

import { Api, SelectedDataHttpURL } from "../utils";
import { Chart } from "react-google-charts";

const MyChart = () => {
  // const [jsonData, setJsonData] = useState({ items: {} });
  const [chartData, setChartData] = useState([]);

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
    legend: {
      textStyle: {
        color: "#fff",
        fontSize: 20,
        textTransform: "uppercase",
      },
    },
  };

  useEffect(() => {
    Api.get(SelectedDataHttpURL)
      .then((res) => {
        initChartData(res.data.record);
        console.log("Data fetched:", res.data.record);
      })
      .catch((error) => console.log("Error saving data:", error));
  }, []);

  return (
    <Container className="align-item-center chart-contaniter py-3">
      <Row>
        {chartData.length > 0 ? (
          <Chart
            chartType="ColumnChart"
            data={chartData}
            options={options}
            width={"100%"}
            height={"800px"}
          />
        ) : (
          <p className="loading mt-5">Loading...</p>
        )}
      </Row>
    </Container>
  );
};

export default MyChart;
