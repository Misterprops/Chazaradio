import { useRef, useEffect, useState } from "react";

export function Lista() {
  const audio = useRef(null);
  const [audios, setAudios] = useState([]);
  //const [indice, setIndice] = useState(null);
  const [playingUrl, setPlayingUrl] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/audios")
      .then(res => res.json())
      .then(data => setAudios(data));
  }, []);

  const handlePlay = (url, index) => {
    if (!audio.current || !audio.current.src.includes(encodeURI(url))) {
      // Si cambia de audio, detener el anterior
      if (audio.current) {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.onended = null;
      }
      audio.current = new Audio(url);
      audio.current.onended = () => {
        if ((index + 1) < audios.length) {
          handlePlay(audios[(index + 1)], (index + 1));
        } else {
          setPlayingUrl(null); // fin de la lista
        }
      };
      audio.current.play();
      //setIndice(index)
      setPlayingUrl(url);
    } else {
      // Si es el mismo, alternar reproducción
      if (audio.current.paused) {
        audio.current.play();
        setPlayingUrl(url);
      } else {
        audio.current.pause();
        setPlayingUrl(null);
      }
    }

    /*if (!audio.current) {
      audio.current = new Audio(url);
    }
    !estado ? audio.current.play() : audio.current.pause();
    setEstado(!estado)*/
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Audios guardados</h2>
      <ul className="space-y-2">
        {audios.map((url, idx) => (
          <li key={idx} className="flex items-center justify-between border p-2 rounded">
            <span>{url.split("/").pop()}</span>
            <button
              onClick={() => handlePlay(url, idx)}
              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {playingUrl === url ? '⏸️ Pausar' : '▶️ Reproducir'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );


  return (
    <div className="flex items-center w-1/1 h-1/1 border-2">
      <table></table>
    </div>
  );
  {
    audios.map((url, idx) => (
      <li key={idx} className="flex items-center gap-4">
        <span className="truncate w-60">{url.split("/").pop()}</span>
        <button
          onClick={() => handlePlay(url)}
          className="bg-green-500 text-white px-2 py-1 rounded"
        >
          ▶️ Reproducir
        </button>
        <a
          href={url}
          download
          className="bg-blue-500 text-white px-2 py-1 rounded"
        >
          ⬇️ Descargar
        </a>
      </li>
    ))
  }
}