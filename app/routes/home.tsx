import type { Route } from "./+types/home";
import { Welcome } from "../components/welcome";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return [<Header nav={["about", "Exit"]}/>,<Welcome nav={"about"}/>,<Footer/>]
}
