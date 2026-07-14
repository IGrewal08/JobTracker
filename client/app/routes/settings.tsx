import { useLoaderData, type LoaderFunctionArgs } from "react-router";
import { authFetch } from "../services/api";
import { requireToken } from "../services/session";
import { Setting } from "../components/Setting/Setting";
import styles from "../styles/Setting.module.css";

export async function loader({ request }: LoaderFunctionArgs) {
    const token = await requireToken(request);
    const user: string = await authFetch("/api/user", token);

    return { user, token };
}

export default function SettingPage() {
    const { user, token } = useLoaderData<typeof loader>();
    return (
        <main className={styles.main}>
            <Setting name={user} token={token}/>
        </main>
    );
}