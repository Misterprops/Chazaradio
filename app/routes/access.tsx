// provides type safety/inference
import { Welcome } from "~/components/welcome";
import type { Route } from "./+types/access";
import { Header } from "~/components/header";

// provides `loaderData` to the component
export function loader({}: Route.LoaderArgs) {
  return [
    {text: "What now"}
  ]
}

// renders after the loader is done
export default function Component({
  loaderData,
}: Route.ComponentProps) {
  return [<Header nav={["/", "Exit"]}/>,<Welcome nav={"/"}/>]
}