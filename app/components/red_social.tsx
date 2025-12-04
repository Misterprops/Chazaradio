import { useState } from "react";
import logo from "/logo.svg"
import { AudioRecorder } from "./recorder";
const API = import.meta.env.VITE_APP_API;

export function Red_social(props) {
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
            formData.append("audio", blob, "grabacion.mp3");

            const res = await fetch(`${API}/api/upload`, {
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
            <div className="flex h-1/8 justify-between  w-1/1">
                <img src={logo} className="h-1/1"></img>
                {props ?
                    <div className="flex flex-col">
                        <span className="text-sm">{props.user}</span>
                    </div>
                    :
                    <div className="flex flex-col">
                        <span className="text-sm">Name</span>
                    </div>
                }

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
            <div className="flex flex-col w-9/10">
                <p>Mira esta cancion ❤️</p>
                <iframe className="w1/1" src="https://www.youtube.com/embed/TW9d8vYrVFQ"></iframe>
            </div>
        </div>
    );
}