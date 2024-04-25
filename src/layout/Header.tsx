import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="w-full p-5 bg-green-900">
            <ul className="flex gap-5">
                <li className={`text-white font-medium transition-all hover:text-green-500 ${location.pathname === "/" ? "text-green-500" : ""}`}>
                    <Link to="/">Converter SVG para imagem</Link>
                </li>
                <li className={`text-white font-medium transition-all hover:text-green-500 ${location.pathname === "/webp" ? "text-green-500" : ""}`}>
                    <Link to="/webp">Converter imagem para .WEBP</Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;