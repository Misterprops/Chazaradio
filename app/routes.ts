//Importacion de elementos para el SPA
import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

//Rutas del SPA
export default [
    //Ruta inicial
    index("routes/home.tsx"),
    route("Login", "routes/access.tsx"),
] satisfies RouteConfig;
