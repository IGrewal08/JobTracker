import { NavLink, useLocation } from "react-router";
import styles from "../styles/Header.module.css";

const paths = ["dashboard", "board", "jobs"];

export default function Header() {
    const location = useLocation();
    console.log((location.pathname).slice(1));
    return (
        <header id={styles.header}>
            <h5>JobTracker</h5>
            <p>MENU</p>
            {(paths.map(path => (
                <NavLink 
                    to={path}
                    className={styles.links}
                    style={{
                        ...((location.pathname.slice(1) === path) 
                        && { 
                            color: "#F4F3EF",
                            background: "linear-gradient(90deg,rgba(31, 74, 48, 1) 0%, rgba(244, 243, 239, 1) 90%)",
                            
                        }),
                    }}
                >
                    {(path === "board") 
                        ? "Applications" 
                        : path.charAt(0).toUpperCase() + path.slice(1)
                    }
                </NavLink>
            )))}
            <p>GENERAL</p>
            <NavLink
                to="/settings"
                className={styles.links}
                style={{
                        ...((location.pathname.slice(1) === "settings") 
                        && { 
                            color: "#F4F3EF",
                            background: "linear-gradient(90deg,rgba(31, 74, 48, 1) 0%, rgba(244, 243, 239, 1) 90%)",
                            
                        }),
                    }}
            >
                Settings
            </NavLink>
            {(location.pathname == "/login") 
                ? <NavLink 
                    to="/register" 
                    id={styles.toAuth} 
                    className={styles.links}>
                        Register
                </NavLink>
                :  (location.pathname != "/login" && location.pathname == "/register")
                    ? <NavLink 
                        to="/login" 
                        id={styles.toAuth} 
                        className={styles.links}>
                        Login
                    </NavLink>
                    : <NavLink 
                        to="/logout"
                        id={styles.toAuth}
                        className={styles.links}
                    >
                        Logout
                    </NavLink>
            }
        </header>
    );
}