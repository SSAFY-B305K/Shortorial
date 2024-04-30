import { useEffect, useRef } from "react";
import styled from "styled-components";
import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";

import sampleVideo from "../../assets/sample.mp4";

interface VideoType {
  width: number;
  height: number;
}

export default function MotionVideo({ width, height }: VideoType) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let videoRunning = false;

    // 비디오 재생 상태를 감시하는 이벤트 리스너 추가
    const handlePlay = () => {
      videoRunning = true;
      console.log("재생 중");

      predictVideo();
    };

    const handlePause = () => {
      videoRunning = false;
      console.log("멈춤");
    };

    videoRef.current?.addEventListener("play", handlePlay);
    videoRef.current?.addEventListener("pause", handlePause);

    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;

    // PoseLandmarker 인스턴스 초기화
    const createPoseLandmarker = async () => {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 2,
      });
    };

    // 그림 그리기 초기화
    createPoseLandmarker();

    const video = document.getElementById("video") as HTMLVideoElement | null;
    const canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    let drawingUtils: DrawingUtils | null = null;

    if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    let lastVideoTime = -1;
    async function predictVideo() {
      if (!canvasElement || !video || !poseLandmarker) return null;

      let startTimeMs = performance.now();
      if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
          if (!canvasCtx || !drawingUtils) return null;
          canvasCtx.save();
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data: any) =>
                DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1),
            });
            drawingUtils.drawConnectors(
              landmark,
              PoseLandmarker.POSE_CONNECTIONS
            );
          }
          canvasCtx.restore();
        });
      }

      if (videoRunning === true) {
        canvasElement.style.display = "block";
        window.requestAnimationFrame(predictVideo);
      } else {
        canvasElement.style.display = "none";
      }
    }
    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 리스너를 제거
      videoRef.current?.removeEventListener("play", handlePlay);
      videoRef.current?.removeEventListener("pause", handlePause);
    };
  }, []);

  return (
    <Container>
      <video
        id="video"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
        ref={videoRef}
        src={sampleVideo}
        controls
      ></video>
      <canvas
        id="output_canvas"
        width={width}
        height={height}
        style={{ objectFit: "cover" }}
      ></canvas>
    </Container>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-color: #000;
`;