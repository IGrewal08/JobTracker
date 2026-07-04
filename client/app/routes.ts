import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    route("/login", "routes/login.tsx"),
    route("/logout", "routes/logout.tsx"),
    route("/register", "routes/register.tsx"),
    layout("AppLayout.tsx", [
        index("routes/_index.tsx"),
        route("/board", "routes/board.tsx"),
        route("/jobs", "routes/jobs.tsx"),
        route("/dashboard", "routes/dashboard.tsx"),
        route("/settings", "routes/settings.tsx"),
    ]),
] satisfies RouteConfig;