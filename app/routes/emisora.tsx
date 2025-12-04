import type { Route } from "./+types/home";
import { Emisora_main } from "../components/emisora_main";
import { Header } from "../components/header";
import { Footer } from "../components/footer";

export function meta({ }: Route.MetaArgs) {
  return [
    //Argumentos para el meta
    { title: "ChazaRadio - Emisora" }
  ];
}

export default function Home() {
  //Formacion de la pagina inicial - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={[["/","Inicio"], ["/Login", "Login"]]}/>, <Emisora_main />, <Footer />]
}
