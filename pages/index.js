import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Button from '@mui/material/Button';

export default function Home() {

  const toStart = ()=>{
    console.log("==前往开始页面===")
    if(window && window.Android){
      window.Android.onButtonClicked('Hello from Next.js');
    } else {
      console.log('Button clicked!');
    }
  }
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      backgroundColor: "#FFFFFF",
      color: "#666666"
    }}>
      <Button onClick={toStart}>登录</Button>
    </div>

  );
}
