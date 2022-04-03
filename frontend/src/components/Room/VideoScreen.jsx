import React from "react";
import VideoJS from "./VideoJS";
import { useParams } from "react-router-dom";

const VideoScreen = () => {
    let params = useParams();
    const baseURL = "http://localhost:5000";
    const playerRef = React.useRef(null);
    let sourceUrl = baseURL + "/video/1BF-5F7/1BF-5F7.m3u8";
    let sourceType = "application/x-mpegURL";
  
    const videoJsOptions = {
      // lookup the options in the docs for more options
      autoplay: false,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{ src: sourceUrl, type: sourceType}]
    };
  
    const handlePlayerReady = (player) => {
      playerRef.current = player;
      // you can handle player events here
      player.on("waiting", () => {
        console.log("player is waiting");
      });
      player.on("dispose", () => {
        console.log("player will dispose");
      });
    };
      
    const changePlayerOptions = () => {
      // you can update the player through the Video.js player instance
      if (!playerRef.current) {
        console.log("player NOT updated");
        return;
      }
      // [update player through instance's api]
      console.log("player updated");
      playerRef.current.src([
        { src: "http://localhost:4000/sampleurl", type: "application/x-mpegURL" },
      ]);
    };
  
    return (
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    )
};

export default VideoScreen;