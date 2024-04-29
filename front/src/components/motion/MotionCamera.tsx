import {
  PoseLandmarker,
  FilesetResolver,
  DrawingUtils,
} from "@mediapipe/tasks-vision";
import { useEffect } from "react";

export default function MotionCamera() {
  useEffect(() => {
    // moiton을 그릴 HTML
    const motionSection = document.getElementById(
      "motion"
    ) as HTMLCanvasElement | null;
    // poseLandmarker instance를 저장할 변수
    let poseLandmarker: PoseLandmarker | null = null;
    // 모드 분류
    let enableWebcamButton: HTMLElement | null;
    let webcamRunning = false;

    // poseLandmarker 초기화
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
      if (motionSection) motionSection.classList.remove("invisible");
    };

    createPoseLandmarker();
    // camera가 있을 HTML
    const webcam = document.getElementById("webcam") as HTMLVideoElement | null;
    // 최종 그림이 나갈 HTML
    const canvasElement = document.getElementById(
      "output_canvas"
    ) as HTMLCanvasElement | null;
    let canvasCtx: CanvasRenderingContext2D | null = null;
    // 그리기 도구
    let drawingUtils: DrawingUtils | null = null;

    if (canvasElement) canvasCtx = canvasElement.getContext("2d");
    if (canvasCtx) drawingUtils = new DrawingUtils(canvasCtx);

    // 카메라가 있는지 확인
    const isGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

    // 카메라가 있으면 작동
    if (isGetUserMedia()) {
      enableWebcamButton = document.getElementById("webcamButton");
      if (enableWebcamButton)
        enableWebcamButton.addEventListener("click", enableCam);
      console.log("카메라가 인식되었습니다.");
    } else {
      console.warn("getUserMedia() is not supported by your browser");
      alert("인식된 카메라가 없습니다.");
    }

    function enableCam() {
      if (!poseLandmarker) {
        console.log("Wait! poseLandmaker not loaded yet.");
        return;
      }
      if (webcamRunning === true) {
        webcamRunning = false;
        if (enableWebcamButton)
          enableWebcamButton.innerText = "ENABLE PREDICTIONS";
      } else {
        webcamRunning = true;
        if (enableWebcamButton)
          enableWebcamButton.innerText = "DISABLE PREDICTIONS";
      }
      // getUsermedia parameters.
      const constraints = {
        video: true,
      };

      // Activate the webcam stream.
      navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
        if (webcam) {
          webcam.srcObject = stream;
          webcam.addEventListener("loadeddata", predictWebcam);
        }
      });
    }

    let lastWebcamTime = -1;
    async function predictWebcam() {
      if (!canvasElement || !webcam || !poseLandmarker) return null;

      // Now let's start detecting the stream.
      let startTimeMs = performance.now();
      if (lastWebcamTime !== webcam.currentTime) {
        lastWebcamTime = webcam.currentTime;
        poseLandmarker.detectForVideo(webcam, startTimeMs, (result) => {
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

      // Call this function again to keep predicting when the browser is ready.
      if (webcamRunning === true) {
        webcam.style.display = "block";
        canvasElement.style.display = "block";
        window.requestAnimationFrame(predictWebcam);
      } else {
        webcam.pause();
        const stream = webcam.srcObject as MediaStream;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach((track) => track.stop());
        }
        webcam.style.display = "none";
        canvasElement.style.display = "none";
      }
    }
  }, []);

  return (
    <div id="motion" className="invisible">
      <video id="webcam" autoPlay playsInline></video>
      <canvas id="output_canvas"></canvas>
      <button
        id="webcamButton"
        style={{ backgroundColor: "white", color: "black" }}
      >
        ENABLE PREDICTIONS
      </button>
    </div>
  );
}
