<script lang="ts">
  import { page } from "$app/stores";
  import { Aside, Header, Menu } from "$lib/components";
  export let data;
  let options: AsideOption[] = [
    {
      paths: [
        { href: "", name: "Inicio", icon: "iconamoon:home", match: true },
        { href: "students", name: "Temporadas", icon: "iconamoon:store" },
        { href: "orders", name: "Ventas", icon: "ph:money-wavy" },
        { href: "classes", name: "Clases", icon: "ph:building" },
        { href: "courses", name: "Cursos", icon: "ph:books" },
      ],
    },
  ];
</script>

<Aside root="/schools/{$page.params.school_id}/seasons/{$page.params.season_id}" {options} />
<main class="flex direction gap4">
  <Header session={data.session} />
  <slot />
</main>
