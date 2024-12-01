import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import LineChart from "./LineChart"; // Ensure this is your chart component
import axios from "axios";

const CryptoChart = () => {
  const [selectedTab, setSelectedTab] = useState(1);
  const [chartData, setChartData] = useState({});
  const [cryptoData, setCryptoData] = useState({});
  const [timeframe, setTimeframe] = useState("1d");
  const [isChartFullscreen, setIsChartFullscreen] = useState(false);

  const intervals = {
    "1d": "1m",
    "3d": "15m",
    "1w": "1h",
    "1m": "4h",
    "6m": "1d",
    "1y": "1w",
    max: "1M",
  };

  const fetchData = async () => {
    try {
      const interval = intervals[timeframe] || "1h";
      const limit = timeframe === "1d" ? 1440 : 168;

      const response = await axios.get(
        "https://api.binance.com/api/v3/klines",
        {
          params: {
            symbol: "BTCUSDT",
            interval: interval,
            limit: limit,
          },
        }
      );

      const prices = response.data.map((entry) => ({
        time: new Date(entry[0]).toLocaleString(),
        price: parseFloat(entry[4]),
      }));

      setCryptoData({
        current: prices[prices.length - 1].price.toFixed(2),
        change: (
          ((prices[prices.length - 1].price - prices[0].price) / prices[0].price) *
          100
        ).toFixed(2),
      });

      setChartData({
        labels: prices.map((p) => p.time),
        datasets: [
          {
            label: "Price in USD",
            data: prices.map((p) => p.price),
            borderColor: "#4CAF50",
            backgroundColor: "rgba(76, 175, 80, 0.1)",
            fill: true,
            pointRadius: 0,
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeframe]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const toggleChartFullscreen = () => {
    setIsChartFullscreen(!isChartFullscreen);
  };

  return (
    <Card
      sx={{
        padding: 3,
        backgroundColor: "#ffffff",
        color: "#333333",
        borderRadius: "16px",
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
        maxWidth: "100%",
        margin: "0 auto",
        height: "100%",
      }}
    >
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 2,
          borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            BTC/USD
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "#777777",
              marginTop: 0.5,
            }}
          >
            {cryptoData.current ? `$${cryptoData.current}` : "Loading..."} •{" "}
            <span
              style={{
                color: cryptoData.change > 0 ? "#4caf50" : "#f44336",
              }}
            >
              {cryptoData.change > 0 ? "+" : ""}
              {cryptoData.change ? `${cryptoData.change}%` : ""}
            </span>
          </Typography>
        </Box>
      </Box>

      {/* Tabs Section */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        textColor="inherit"
        indicatorColor="primary"
        sx={{
          marginTop: 2,
          backgroundColor: "#f4f4f4",
          borderRadius: "8px",
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab label="Summary" />
        <Tab label="Chart" />
        <Tab label="Statistics" />
        <Tab label="Analysis" />
        <Tab label="Settings" />
      </Tabs>

      {/* Timeframe Selector */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          marginTop: 3,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {["1d", "3d", "1w", "1m", "6m", "1y", "max"].map((time) => (
          <button
            key={time}
            onClick={() => setTimeframe(time)}
            style={{
              padding: "8px 16px",
              borderRadius: "4px",
              backgroundColor: timeframe === time ? "#4CAF50" : "#f0f0f0",
              color: timeframe === time ? "#ffffff" : "#333",
              border: "none",
              cursor: "pointer",
            }}
          >
            {time.toUpperCase()}
          </button>
        ))}
      </Box>

      {/* Display Data or Message Based on Tab Selection */}
      {selectedTab === 1 && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            position: isChartFullscreen ? "fixed" : "relative",
            top: isChartFullscreen ? 0 : "unset",
            left: isChartFullscreen ? 0 : "unset",
            width: isChartFullscreen ? "100vw" : "100%",
            height: isChartFullscreen ? "100vh" : "auto",
            zIndex: isChartFullscreen ? 1300 : "unset",
            maxWidth: "100%",
            overflowX: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginBottom: 1,
            }}
          >
            <IconButton
              onClick={toggleChartFullscreen}
              sx={{
                backgroundColor: "#e0e0e0",
                "&:hover": { backgroundColor: "#d6d6d6" },
              }}
            >
              {isChartFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
            </IconButton>
          </Box>
          {chartData.labels ? (
            <LineChart chartData={chartData} />
          ) : (
            <Typography variant="subtitle1" sx={{ textAlign: "center" }}>
              Loading chart data...
            </Typography>
          )}
        </Box>
      )}

      {/* For Other Tabs (Summary, Statistics, Analysis, Settings) */}
      {selectedTab !== 1 && (
        <Box
          sx={{
            marginTop: 3,
            padding: 2,
            backgroundColor: "#f9f9f9",
            borderRadius: "12px",
            textAlign: "center",
          }}
        >
          <Typography variant="h6">
            Data will be available soon.
          </Typography>
        </Box>
      )}
    </Card>
  );
};

export default CryptoChart;
