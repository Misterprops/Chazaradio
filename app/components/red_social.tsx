import { useState } from "react";
import logo from "./logo-light.svg"
import { AudioRecorder } from "./recorder";

export function Red_social() {
    const [audioUrl, setAudioUrl] = useState(null);
    const [blob, setBlob] = useState(null);

    const handleRecordingComplete = async (blob, url) => {
        setAudioUrl(url);
        setBlob(blob)
    };

    const handlePlay = () => {
        if (audioUrl) {
            const audio = new Audio(audioUrl);
            audio.play();
        }
    };

    const upload = async () => {
        try {
            const formData = new FormData();
            formData.append("audio", blob, "grabacion.webm");

            const res = await fetch("http://localhost:3001/api/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();
            console.log("Archivo guardado en:", data.url);
        } catch (error) {
            console.error("Error:", error);
        }
    }
    return (
        <div className="flex items-center w-1/1 h-1/1 border-2 flex-col">
            <div className="flex flex-row">
                <img src={logo} className="w-1/5"></img>
                <span className="text-sm">Name</span>
            </div>
            <AudioRecorder onRecordingComplete={handleRecordingComplete} />
            {audioUrl && (
                <button
                    onClick={handlePlay}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    🔊 Escuchar grabación
                </button>
            )}
            {audioUrl && (
                <button
                    onClick={upload}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    🔊 Subir grabacion
                </button>
            )}
            <iframe className="w-9/10" src="http://www.youtube.com/embed/JcRcTRedS_8"></iframe>
        </div>
    );
}