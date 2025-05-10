import { useState, useRef } from "react";

export const AudioRecorder = ({ onRecordingComplete }) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
      const audioUrl = URL.createObjectURL(audioBlob);
      audioChunksRef.current = [];

      if (onRecordingComplete) {
        onRecordingComplete(audioBlob, audioUrl);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setRecording(false);
  };

  return (
    <div className="flex gap-4 items-center">
      {!recording ? (
        <button onClick={startRecording}>
          🎙️ Empezar
        </button>
      ) : (
        <button onClick={stopRecording}>
          ⏹️ Detener
        </button>
      )}
    </div>
  );
};