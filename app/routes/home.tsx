import type { Route } from "./+types/home";
import { Social_main } from "../components/social_base";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function meta({ }: Route.MetaArgs) {
  return [
    //Argumentos para el meta
    { title: "ChazaRadio" }
  ];
}

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={["Login", "Exit"]} />, <Social_main />, <Footer />]
}
