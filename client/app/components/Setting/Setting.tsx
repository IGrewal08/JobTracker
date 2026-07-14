import styles from "../../styles/Setting.module.css"
import { authFetch } from "../../services/api";
import { useNavigate } from "react-router";
import { useState } from "react";

export function Setting(Props: { name: string, token: string }) {
    const [newName, setNewName] = useState(Props.name);
    const navigate = useNavigate();

    const handleDelete = async () => {
        const res = confirm("click OK to delete your account");
        if (res) {
            try {
                await authFetch("/api/user", Props.token, { method: "DELETE" });
                navigate("/login");
            } catch (err: any) {
                console.error("Failed to delete account:", err.message);
            }
        }
    }

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            authFetch("/api/user", Props.token, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newName }),
            });
            navigate("/dashboard");
        } catch (err) {
            console.error("Failed to update name:", err);
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>SETTINGS</h1>
                    <p className={styles.pageSubtitle}>Update Account Information.</p>
                </div>
            </div>
            <div className={styles.options}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <label>Update Name</label>
                    <input placeholder={newName} onChange={(e) => setNewName(e.target.value)}/>
                    <button type="submit">Change</button>
                </form>
                <div className={styles.deleteContainer}>
                    <p>Warning! This will permanently delete your account.</p>
                    <button onClick={() => handleDelete()}>Delete Account</button>
                </div>
            </div>
        </div>
    );
}