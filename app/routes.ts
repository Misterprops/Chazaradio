import {
    type RouteConfig,
    route,
    index,
    layout,
    prefix,
} from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("about", "routes/access.tsx"),
] satisfies RouteConfig;
