import { Lista } from "./lista";
import { Perfil } from "./perfil";
import { Red_social } from "./red_social";

export function Welcome() {
  return (
    <main className="flex justify-center pt-4 pb-4 h-4/5">
      <section className="w-1/3">
        <Perfil/>
      </section>
      <section className="w-2/5">
        <Red_social/>
      </section>
      <section className="w-1/3">
        <Lista/>
      </section>
    </main>
  );
}