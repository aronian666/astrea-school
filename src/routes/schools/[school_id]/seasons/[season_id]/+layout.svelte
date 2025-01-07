<script lang="ts">
  import { page } from "$app/stores";
  import { Aside, Header, Icon, Menu } from "$lib/components";
  let options: AsideOption[] = [
    {
      paths: [
        { href: "", name: "Inicio", icon: "iconamoon:home", match: true },
        { href: "students", name: "Estudiantes", icon: "ph:user" },
        { href: "classes", name: "Clases", icon: "ph:buildings" },
        { href: "orders", name: "Ventas", icon: "ph:money-wavy" },
        { href: "concepts", name: "Conceptos", icon: "ph:book-open" },
      ],
    },
  ];
  const root = `/schools/${$page.params.school_id}/seasons/${$page.params.season_id}`;
</script>

<Aside {root} {options} />
<main class="flex direction gap4">
  <slot />
</main>
