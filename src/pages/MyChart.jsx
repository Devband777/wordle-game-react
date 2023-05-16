import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import { useLocation } from "react-router-dom";
import { Chart } from "react-google-charts";

import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

const MyChart = () => {
  // const [jsonData, setJsonData] = useState({ items: {} });
  const [chartData, setChartData] = useState([]);
  const location = useLocation();
  const recievedData = location.state.passData; // accessing the passed data
  const colors = ["#0077FF", "#FF7F50", "#008000", "#FFA07A", "#800080"];
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const initChartData = (data) => {
    let temp = 0;
    Object.keys(data.items).forEach((item) => {
      temp += data.items[item].rank;
    });
    const tempChartData = [["Title", "Like", { role: "style" }]];
    Object.keys(data.items).forEach((item, idx) => {
      tempChartData.push([
        data.items[item].title,
        (100 * data.items[item].rank) / temp,
        colors[idx],
      ]);
    });
    console.log(tempChartData);
    setChartData(tempChartData);
  };
  const options = {
    title: "Like chart, Topic: " + recievedData.title,
    backgroundColor: "none",
    titleTextStyle: {
      color: "#fff", // set the title color
      fontSize: 24, // set the title font size
    },
    subtitle: false,
    legend: {
      textStyle: {
        color: "#fff",
        fontSize: 14,
        textTransform: "uppercase",
      },
    },
    vAxis: { minValue: 0 },
  };

  const handleDownload = () => {
    const container = document.getElementById("chart-view");

    html2canvas(container, {
      scale: 25, // Set scale to 25x for full HD resolution (1920x1080)
      useCORS: true, // Enable CORS to allow screenshot of external images
    }).then((canvas) => {
      canvas.toBlob((blob) => saveAs(blob, "chart.png"));
    });
  };

  const handleShare = () => {
    setShared(true);
  }

  const handleURLCopy = () => {
    console.log(window.location.href);
    const currentURL = window.location.href;
    const tempURL = currentURL.replace("chart", recievedData.title);
    navigator.clipboard.writeText(tempURL);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  useEffect(() => {
    initChartData(recievedData);
  }, [recievedData]);

  return (
    <Container className="align-item-center chart-contaniter py-3">
      {chartData.length > 0 ? (
        <Row>
          <Col md={8} sm={12} id="chart-view">
            <Chart
              chartType="ColumnChart"
              data={chartData}
              options={options}
              width={"100%"}
              height={"600px"}
            />
          </Col>
          <Col md={4} sm={12} className="chart-action">
            {/* {shared ? (
              <div className="col-12 d-flex flex-column  gap-1">
                <div className="d-flex flex-row gap-1 justify-content-between">
                  <button style={{ width:'80%' }} className="btn btn-primary">Twitter</button>
                  <button style={{ width:'80%' }} className="btn btn-dark">Facebook</button>
                </div>
                <div className="d-flex flex-row gap-1 justify-content-between">
                  <button style={{ width:'80%' }} className="btn btn-success">Whatsapp</button>
                  <button style={{ width:'80%' }} className="btn btn-danger">Reddit</button>
                </div>
              </div>
            ) : (
              <div onClick={handleShare} className="col-12 chart-action-item">
                <b>Share your result!</b>
              </div>
            )} */}
            <div onClick={handleURLCopy} className="col-12 chart-action-item">
              {copied ? "Link copied!" : "Copy link to this topic"}
            </div>
            <div onClick={handleDownload} className="col-12 chart-action-item">
              Downlaod chart image
            </div>
          </Col>
        </Row>
      ) : (
        <p className="loading mt-5">Loading...</p>
      )}
    </Container>
  );
};

export default MyChart;
