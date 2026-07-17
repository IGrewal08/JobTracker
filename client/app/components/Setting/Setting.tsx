import styles from "../../styles/Setting.module.css"
import { useSubmit, useActionData } from "react-router";
import { useState } from "react";
import type { action } from "../../routes/settings";
import type { User } from "../../types";

export function Setting({name}: User) {
    const [newName, setNewName] = useState(name);
    const submit = useSubmit();
    const actionData = useActionData<typeof action>();


    const handleDelete = () => {
        const confirmDelete = confirm("click OK to delete your account");
        if (confirmDelete) {
            submit({ intent: "delete-account" }, { method: "post" });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.pageHeader}>
                <div>
                    <h1 className={styles.pageTitle}>SETTINGS</h1>
                    <p className={styles.pageSubtitle}>Update Account Information.</p>
                </div>
            </div>

            {actionData?.error && (
                <div className={styles.errorAlert}>{actionData.error}</div>
            )}

            <div className={styles.options}>
                <form className={styles.form} method="post">
                    <label htmlFor="newName">Update Name</label>
                    <input 
                        id="newName"
                        name="newName"
                        value={newName} 
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button type="submit" name="intent" value="update-name">
                        Change
                    </button>
                </form>

                <div className={styles.deleteContainer}>
                    <p>Warning! This will permanently delete your account.</p>
                    <button type="button" onClick={() => handleDelete()}>
                        Delete Account
                    </button>
                </div>
            </div>
        </div>
    );
}