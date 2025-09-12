import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, Link, useNavigate, useLocation } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useRef, useState, useEffect } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component2) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component2, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
function Lista() {
  const audio = useRef(null);
  const [audios, setAudios] = useState([]);
  const [playingUrl, setPlayingUrl] = useState(null);
  useEffect(() => {
    fetch("http://localhost:3000/audios").then((res) => res.json()).then((data) => setAudios(data));
  }, []);
  const handlePlay = (url, index) => {
    if (!audio.current || !audio.current.src.includes(encodeURI(url))) {
      if (audio.current) {
        audio.current.pause();
        audio.current.currentTime = 0;
        audio.current.onended = null;
      }
      audio.current = new Audio(url);
      audio.current.onended = () => {
        if (index + 1 < audios.length) {
          handlePlay(audios[index + 1], index + 1);
        } else {
          setPlayingUrl(null);
        }
      };
      audio.current.play();
      setPlayingUrl(url);
    } else {
      if (audio.current.paused) {
        audio.current.play();
        setPlayingUrl(url);
      } else {
        audio.current.pause();
        setPlayingUrl(null);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "p-4", children: [
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold mb-2", children: "Audios guardados" }),
    /* @__PURE__ */ jsx("ul", { className: "space-y-2", children: audios.map((url, idx) => /* @__PURE__ */ jsxs("li", { className: "flex items-center justify-between border p-2 rounded", children: [
      /* @__PURE__ */ jsx("span", { children: url.split("/").pop() }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => handlePlay(url, idx),
          className: "px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600",
          children: playingUrl === url ? "⏸️ Pausar" : "▶️ Reproducir"
        }
      )
    ] }, idx)) })
  ] });
}
const logo = "/logo.svg";
function Perfil(props) {
  const [url, setUrl] = useState("");
  const agregar = async (link) => {
    try {
      const res = await fetch("http://localhost:3000/api/descargar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url: link })
      });
      const data = await res.json();
      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return [
    /* @__PURE__ */ jsxs("div", { className: "flex w-1/1 h-1/2 border-2", children: [
      /* @__PURE__ */ jsx("div", { className: "w-1/3", children: /* @__PURE__ */ jsx("img", { src: logo, className: "w-1/1" }) }),
      props ? /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { children: props.user }),
        /* @__PURE__ */ jsx("span", { children: props.mail })
      ] }) : /* @__PURE__ */ jsxs("div", { className: "flex flex-col", children: [
        /* @__PURE__ */ jsx("span", { children: "Name" }),
        /* @__PURE__ */ jsx("span", { children: "E-mail" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-1/1 h-1/2 border-2", children: [
      /* @__PURE__ */ jsx("input", { className: "border-2 bg-fuchsia-300 w-1/1 h-1/2", value: url, onChange: (e) => setUrl(e.target.value) }),
      /* @__PURE__ */ jsx("button", { className: "border-2 bg-amber-300 w-1/1 h-1/2 cursor-pointer", onClick: () => agregar(url), children: "download" })
    ] })
  ];
}
const AudioRecorder = ({ onRecordingComplete }) => {
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
    var _a;
    (_a = mediaRecorderRef.current) == null ? void 0 : _a.stop();
    setRecording(false);
  };
  return /* @__PURE__ */ jsx("div", { className: "flex gap-4 items-center", children: !recording ? /* @__PURE__ */ jsx("button", { onClick: startRecording, className: "hover:cursor-pointer hover:border-2", children: "🎙️ Empezar" }) : /* @__PURE__ */ jsx("button", { onClick: stopRecording, children: "⏹️ Detener" }) });
};
function Red_social(props) {
  const [audioUrl, setAudioUrl] = useState(null);
  const [blob, setBlob] = useState(null);
  const handleRecordingComplete = async (blob2, url) => {
    setAudioUrl(url);
    setBlob(blob2);
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
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      console.log("Archivo guardado en:", data.url);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center w-1/1 h-1/1 border-2 flex-col", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex h-1/8 justify-between  w-1/1", children: [
      /* @__PURE__ */ jsx("img", { src: logo, className: "h-1/1" }),
      props ? /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: props.user }) }) : /* @__PURE__ */ jsx("div", { className: "flex flex-col", children: /* @__PURE__ */ jsx("span", { className: "text-sm", children: "Name" }) })
    ] }),
    /* @__PURE__ */ jsx(AudioRecorder, { onRecordingComplete: handleRecordingComplete }),
    audioUrl && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: handlePlay,
        className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
        children: "🔊 Escuchar grabación"
      }
    ),
    audioUrl && /* @__PURE__ */ jsx(
      "button",
      {
        onClick: upload,
        className: "mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700",
        children: "🔊 Subir grabacion"
      }
    ),
    /* @__PURE__ */ jsx("iframe", { className: "w-9/10", src: "http://www.youtube.com/embed/JcRcTRedS_8" })
  ] });
}
const Social_main = () => {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const user = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/user_data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ user: "mister" })
        });
        setUserData(await res.json());
      } catch (error) {
        console.error("Error:", error);
      }
    };
    user();
  }, []);
  return (
    //Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)
    /* @__PURE__ */ jsxs("main", { className: "flex justify-center pt-4 pb-4 h-4/5", children: [
      /* @__PURE__ */ jsx("section", { className: "w-1/3", children: /* @__PURE__ */ jsx(Perfil, { user: userData ? userData.user : "Cargando", mail: userData ? userData.mail : "Cargando" }) }),
      /* @__PURE__ */ jsx("section", { className: "w-2/5", children: /* @__PURE__ */ jsx(Red_social, { user: userData ? userData.user : "Cargando" }) }),
      /* @__PURE__ */ jsx("section", { className: "w-1/3", children: /* @__PURE__ */ jsx(Lista, {}) })
    ] })
  );
};
const Header = (props) => {
  return (
    /* Header de la pagina - Flexbox, items centrados, background amarillo, altura de 10% */
    /* @__PURE__ */ jsxs("header", { className: "flex items-center bg-yellow-300 h-1/10", children: [
      /* @__PURE__ */ jsx("img", { src: logo, className: "h-1/1" }),
      /* @__PURE__ */ jsx("nav", {
        className: "flex items-center style-none justify-between",
        //Lista los elementos de navegacion
        children: listar(props.nav)
      })
    ] })
  );
};
function listar(array) {
  const elements = array.map((element) => /* @__PURE__ */ jsx("div", { className: "flex", children: /* @__PURE__ */ jsx(Link, { to: element, children: element }) }));
  return elements;
}
const Footer = () => {
  return (
    //Footer - Flexbox, items centrados, horientado a columna, background rojo, altura del 10%
    /* @__PURE__ */ jsxs("footer", { className: "flex items-center flex-col bg-red-600 h-1/10", children: [
      /* @__PURE__ */ jsx("span", { children: "Elaborado por: Andres y Alejandro" }),
      /* @__PURE__ */ jsx("span", { children: "Idea de Marlon" }),
      /* @__PURE__ */ jsx("span", { children: "Desarrollado para la UD" })
    ] })
  );
};
function meta$1({}) {
  return [
    //Argumentos para el meta
    {
      title: "ChazaRadio"
    }
  ];
}
const home = withComponentProps(function Home() {
  return [/* @__PURE__ */ jsx(Header, {
    nav: ["Login", "Exit"]
  }), /* @__PURE__ */ jsx(Social_main, {}), /* @__PURE__ */ jsx(Footer, {})];
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const Log = () => {
  const [user, setUser] = useState("");
  const [password, setpassword] = useState("");
  const navigate = useNavigate();
  const login = async (user2, password2) => {
    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: user2,
          password: password2
        })
      });
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        if (res.status === 400) {
          alert("Contraseña erronea");
        } else {
          alert(res.status);
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-1/1 h-1/1", children: [
    /* @__PURE__ */ jsx("h1", { className: "h-1/10 font-bold", children: "Login" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col h-4/5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "user", children: "Usuario" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "user", value: user, onChange: (e) => setUser(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", children: "Contraseña" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "password", value: password, onChange: (e) => setpassword(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: (e) => {
        e.preventDefault();
        login(user, password);
      }, className: "border-2", children: "Login" })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "h-1/10", children: /* @__PURE__ */ jsx(Link, { to: "../Login", state: { tipo: true }, children: "Registrarse" }) })
  ] });
};
const registrar = async (data) => {
  alert("registra: " + data.user + "-" + data.password + "-" + data.mail);
  try {
    const res = await fetch("http://localhost:3000/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.mail,
        password: data.password,
        user: data.user
      })
    });
  } catch (error) {
    console.error("Error:", error);
  }
};
const validar = async (data) => {
  try {
    const res = await fetch("http://localhost:3000/api/verificar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: data.mail,
        codigo: data.code
      })
    });
    alert(res);
  } catch (error) {
    console.error("Error:", error);
  }
};
const Register = () => {
  const [user, setUser] = useState("");
  const [password, setpassword] = useState("");
  const [mail, setmail] = useState("");
  const [code, setCode] = useState("");
  return /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-1/1 h-1/1", children: [
    /* @__PURE__ */ jsx("h1", { className: "h-1/10 font-bold", children: "Register" }),
    /* @__PURE__ */ jsxs("form", { className: "flex flex-col h-4/5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "user", children: "Usuario" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "user", value: user, onChange: (e) => setUser(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "password", children: "Contraseña" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "password", value: password, onChange: (e) => setpassword(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "mail", children: "Correo" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "mail", value: mail, onChange: (e) => setmail(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: (e) => {
        e.preventDefault();
        const data = { user, password, mail };
        registrar(data);
      }, className: "border-2", children: "Registrar" })
    ] }),
    /* @__PURE__ */ jsxs("form", { children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "code", children: "Codigo" }),
        /* @__PURE__ */ jsx("input", { type: "text", id: "code", value: code, onChange: (e) => setCode(e.target.value), className: "bg-white" })
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: (e) => {
        e.preventDefault();
        const data = { code, mail };
        validar(data);
      }, className: "border-2", children: "Registrar" })
    ] }),
    /* @__PURE__ */ jsx("button", { className: "h-1/10", children: /* @__PURE__ */ jsx(Link, { to: "../Login", state: { tipo: false }, children: "Login" }) })
  ] });
};
const Logger = () => {
  let register;
  const location = useLocation();
  try {
    register = location.state.tipo;
  } catch (e) {
    register = false;
  }
  return (
    //Main del html - Flexbox, justificado al centro, paddin arriba y abajo de 1 rem (16px)
    /* @__PURE__ */ jsx("main", { className: "flex justify-center pt-4 pb-4 h-4/5 bg-amber-100", children: register ? (
      /* Llama el registro del usuario */
      /* @__PURE__ */ jsx(Register, {})
    ) : (
      /* Llama el login del usuario */
      /* @__PURE__ */ jsx(Log, {})
    ) })
  );
};
function meta({}) {
  return [
    //Argumentos para el meta
    {
      title: "Inicio de sesion"
    }
  ];
}
function loader({}) {
  return [
    //LoaderData
    {
      Data: "Esto es un placeholder"
    }
  ];
}
const access = withComponentProps(function Component({
  loaderData
}) {
  return [/* @__PURE__ */ jsx(Header, {
    nav: ["/", "Exit"]
  }), /* @__PURE__ */ jsx(Logger, {}), /* @__PURE__ */ jsx(Footer, {})];
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: access,
  loader,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-BradJkQK.js", "imports": ["/assets/chunk-KNED5TY2-_0w-D9js.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-BizmyLP0.js", "imports": ["/assets/chunk-KNED5TY2-_0w-D9js.js", "/assets/with-props-Dm20DvoO.js"], "css": ["/assets/root-Cred30JP.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CwsGHLnI.js", "imports": ["/assets/with-props-Dm20DvoO.js", "/assets/chunk-KNED5TY2-_0w-D9js.js", "/assets/footer-bP2yV9_R.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/access": { "id": "routes/access", "parentId": "root", "path": "Login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/access-DiFOz3XX.js", "imports": ["/assets/with-props-Dm20DvoO.js", "/assets/chunk-KNED5TY2-_0w-D9js.js", "/assets/footer-bP2yV9_R.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-8e5550db.js", "version": "8e5550db", "sri": void 0 };
const assetsBuildDirectory = "build\\client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  },
  "routes/access": {
    id: "routes/access",
    parentId: "root",
    path: "Login",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
