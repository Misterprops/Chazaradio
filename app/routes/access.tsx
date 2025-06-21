// provides type safety/inference
import type { Route } from "./+types/access";
import { Header } from "~/components/header";
import { Footer } from "~/components/footer";
import { Logger } from "~/components/logger";

export function meta({}: Route.MetaArgs) {
  return [
    //Argumentos para el meta
    { title: "Inicio de sesion" }
  ];
}

// provides `loaderData` to the component
export function loader({}: Route.LoaderArgs) {
  return [
    //LoaderData
    {Data: "Esto es un placeholder"}
  ]
}

// renders after the loader is done
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  //Formacion de acceso - Header envia por props los elementos de navegacion, El cuerpo del documento y el footer
  return [<Header nav={["/", "Exit"]}/>,<Logger/>,<Footer/>]
}