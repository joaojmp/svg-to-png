import { useEffect, useState } from "react";

import { FaCircle, FaMoon, FaSun } from "react-icons/fa";

export default function Theme() {
    const [theme, setTheme] = useState<string>(localStorage.theme ?? "dark");
    const [loaded, setLoaded] = useState<boolean>(false);

    useEffect(() => {
        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(theme)
        setLoaded(true);
    }, [theme, setLoaded]);

    function changeTheme() {
        const newTheme = theme == "dark" ? "light" : "dark";

        setTheme(newTheme);

        document.documentElement.classList.remove("light", "dark")
        document.documentElement.classList.add(newTheme)

        localStorage.setItem("theme", newTheme);
    }

    return (
        <button type="button" className="rounded-md p-2" onClick={changeTheme} title="Mudar tema">
            {loaded ? (theme == "dark" ? <FaSun /> : <FaMoon />) : <FaCircle />}
        </button >
    );
}
