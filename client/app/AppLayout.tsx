import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { requireToken } from "./services/session";
import { authFetch } from "./services/api";
import type { User } from "./types";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);
    const user: User = await authFetch("/api/user", token);
    console.log(user);
    return { user };
}

export default function AppLayout() {
    //const { user } = useLoaderData<typeof loader>();
    const user = {
        name: "test"
    }
    return (
        <>
            <Header name={user.name} />
            <Outlet />
            <Footer />
        </>
    );
}