import { Link } from "react-router";
import logo from "./logo-light.svg"

export function Header(props) {
  return (
    <header className="flex items-center bg-yellow-300 h-1/10">
        <img src={logo} className="w-1/10 h-1/10"></img>
        <nav className="flex items-center style-none justify-between">
            {listar(props.nav)}
        </nav>
    </header>
  );
}

function listar(array){
    const elements = array.map(element => <div className="flex"><Link to={element}>{element}</Link></div>)
    return elements
}