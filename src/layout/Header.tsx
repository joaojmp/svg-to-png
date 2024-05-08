import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="w-full p-5 bg-green-900">
            <ul className="flex gap-5">
                <li className={`text-white font-medium transition-all hover:text-green-500 ${location.hash === "#/" ? "!text-green-500" : ""}`}>
                    <Link to="/" relative="path">Converter SVG</Link>
                </li>
                <li className={`text-white font-medium transition-all hover:text-green-500 ${location.hash === "#/webp" ? "!text-green-500" : ""}`}>
                    <Link to="/webp" relative="path">Converter imagem</Link>
                </li>
            </ul>
        </header>
    );
};

export default Header;