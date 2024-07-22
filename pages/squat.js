import React, { useState, useEffect } from "react";
import Head from "next/head";
import {
  Container,
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
  ThemeProvider,
  createTheme,
  Slider,
} from "@mui/material";
import useAccelerometer from "../hooks/useAccelerometer";

// const theme = createTheme({
//   palette: {
//     primary: {
//       main: "#3f51b5", // 稍微亮一点的蓝色
//     },
//     secondary: {
//       main: "#ffd700", // 金色
//     },
//     background: {
//       default: "#f5f5f5",
//       paper: "#1c2331", // 深蓝灰色背景
//     },
//     text: {
//       primary: "#ffffff", // 主要文字为白色
//       secondary: "#b0bec5", // 次要文字为浅灰色
//     },
//   },
// });

const theme = createTheme({
  palette: {
    primary: {
      main: "#1a237e", // 深蓝色
    },
    secondary: {
      main: "#ffd700", // 金色
    },
    background: {
      default: "#0a1929", // 更深的蓝色背景
      paper: "#0d2137", // 稍微亮一点的深蓝色作为卡片背景
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0bec5",
    },
  },
});

const MotivationalPhrase = () => {
  const motivationalPhrases = [
    "每一次深蹲都是通向更强大的你的阶梯。",
    "坚持深蹲，塑造更好的自己。",
    "深蹲不仅锻炼你的身体，更锻炼你的意志。",
    "今天的汗水，就是明天的力量。",
    "挑战自我，突破极限，从每一次深蹲开始。",
    "深蹲是王者运动，你就是那个王者。",
    "不要数深蹲的次数，要让每次深蹲都数得上。",
    "痛苦是暂时的，放弃是永远的。坚持深蹲！",
    "强大的双腿来自于坚持不懈的深蹲。",
    "深蹲是一种生活方式，选择强大，选择健康。",
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentPhraseIndex(
        (prevIndex) => (prevIndex + 1) % motivationalPhrases.length
      );
    }, 5000); // 每5秒切换一次

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Typography
      variant="body1"
      align="center"
      sx={{
        minHeight: "3em",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontStyle: "italic",
        my: 2,
        opacity: 0,
        animation: "fadeIn 0.5s ease-in forwards",
        "@keyframes fadeIn": {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      }}
    >
      {motivationalPhrases[currentPhraseIndex]}
    </Typography>
  );
};

export default function SquatAccelerometer() {
  const [manualCount, setManualCount] = useState(0);

  const {
    support,
    permission,
    acceleration,
    requestPermission,
    sensitivity,
    changeSensitivity,
    squatCount,
    isSquatting,
    incrementSquatCount,
  } = useAccelerometer();

  const handleSensitivityChange = (event, newValue) => {
    changeSensitivity(newValue);
  };

  const handleManualIncrement = () => {
    setManualCount((prevCount) => prevCount + 1);
  };

  const renderContent = () => {
    if (support === "checking") {
      return <CircularProgress />;
    }

    if (support === "unsupported") {
      return (
        <Box>
          <Typography variant="body1" gutterBottom>
            抱歉，您的设备或浏览器不支持加速度计。
          </Typography>
          <Typography variant="body1" gutterBottom>
            您可以使用手动计数：
          </Typography>
          <Button
            variant="contained"
            onClick={handleManualIncrement}
            fullWidth
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.primary.main,
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: theme.palette.secondary.dark,
                transform: "translateY(-2px)",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
              },
              transition: "all 0.3s ease-in-out",
            }}
          >
            计数深蹲
          </Button>
          <Typography variant="h3" align="center" mt={2}>
            深蹲次数：{manualCount}
          </Typography>
          <MotivationalPhrase />
        </Box>
      );
    }

    if (permission === "prompt") {
      return (
        <Button variant="contained" onClick={requestPermission} fullWidth>
          授予权限
        </Button>
      );
    }

    if (permission === "granted") {
      return (
        <Box>
          <Typography
            variant="body2"
            align="center" // 添加这个属性
            color="text.secondary"
            gutterBottom
          >
            请保持手机屏幕朝向您，以获得最佳效果
          </Typography>
          <Typography
            variant="h1"
            align="center"
            sx={{
              fontWeight: 700,
              fontSize: "6rem",
              color: theme.palette.secondary.main, // 使用金色作为数字颜色
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            {squatCount}
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            深蹲次数
          </Typography>
          <MotivationalPhrase />
          {acceleration && (
            <Typography variant="body2" align="center" gutterBottom>
              加速度:{" "}
              {Math.sqrt(
                acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2
              ).toFixed(2)}{" "}
              m/s²
            </Typography>
          )}
          <Typography variant="body1" align="center">
            状态: <strong>{isSquatting ? "下蹲中" : "站立中"}</strong>
          </Typography>
          <Box mt={2}>
            <Typography id="sensitivity-slider" gutterBottom>
              灵敏度
            </Typography>
            <Slider
              value={sensitivity}
              onChange={handleSensitivityChange}
              aria-labelledby="sensitivity-slider"
              step={0.1}
              marks={[
                { value: 0.2, label: "高" },
                { value: 5, label: "低" },
              ]}
              min={0.2}
              max={5}
              valueLabelDisplay="auto"
              sx={{
                color: theme.palette.secondary.main,
                "& .MuiSlider-thumb": {
                  backgroundColor: theme.palette.secondary.main,
                  border: `2px solid ${theme.palette.primary.main}`,
                },
                "& .MuiSlider-valueLabel": {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.background.paper,
                },
              }}
            />
            <Typography variant="body2" color="textSecondary" mt={1}>
              提示：向左调节提高灵敏度（对小幅度动作更敏感），向右调节降低灵敏度（需要更大幅度动作才触发）。请根据实际情况调整以获得最佳效果。
            </Typography>
          </Box>
        </Box>
      );
    }

    if (permission === "denied") {
      return (
        <Typography variant="body1" color="error">
          访问加速度计的权限被拒绝。
        </Typography>
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Head>
        <title>深蹲计数器</title>
        <meta name="description" content="使用加速度计的深蹲计数器" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
      </Head>

      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: { xs: "16px", sm: "24px" },
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Paper
          // elevation={3}
          // sx={{
          //   p: { xs: 2, sm: 3, md: 4 },
          //   width: "100%",
          //   maxWidth: "600px",
          //   borderRadius: 4,
          //   background: "linear-gradient(135deg, #1a237e 0%, #283593 100%)",
          //   color: "white",
          //   boxShadow:
          //     "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
          // }}
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 4 },
            width: "100%",
            maxWidth: "600px",
            borderRadius: 4,
            background: `linear-gradient(135deg, 
              ${theme.palette.background.paper} 0%, 
              ${theme.palette.primary.dark} 100%)`,
            color: "white",
            boxShadow:
              "0 10px 20px rgba(0,0,0,0.3), 0 6px 6px rgba(0,0,0,0.23)",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `linear-gradient(45deg, 
                rgba(255,255,255,0.1) 0%, 
                rgba(255,255,255,0.05) 50%, 
                rgba(255,255,255,0) 100%)`,
              zIndex: 1,
            },
            "& > *": {
              position: "relative",
              zIndex: 2,
            },
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            align="center"
            sx={{
              fontFamily: "'Roboto Condensed', sans-serif",
              fontWeight: 900,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.palette.secondary.main, // 使用金色作为标题颜色
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
              marginBottom: 3,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.5rem" },
              "& > span": {
                display: "inline-block",
                padding: "0.2em 0.5em",
                background: `linear-gradient(45deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                borderRadius: "4px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                border: `2px solid ${theme.palette.secondary.main}`,
              },
            }}
          >
            <span>深蹲计数器</span>
          </Typography>
          {renderContent()}
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
