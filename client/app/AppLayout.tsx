import { Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { requireToken } from "./services/session";
import { authFetch } from "./services/api";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);
    const user: string = await authFetch("/api/user", token);
    return { user };
}

export default function AppLayout() {
    const { user } = useLoaderData<typeof loader>();
    return (
        <>
            <Header user={user} />
            <Outlet />
            <Footer />
        </>
    );
}