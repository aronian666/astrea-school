<script lang="ts">
  import { page } from "$app/stores";
  import Aside from "$lib/components/Aside.svelte";
  let options: AsideOption[] = [
    {
      paths: [
        { href: "", icon: "ph:building", name: "Inicio", match: true },
        { href: "seasons", icon: "ph:calendar-dots", name: "Temporadas" },
        { href: "courses", icon: "ph:calendar-plus", name: "Cursos" },
      ],
    },
  ];
</script>

<Aside root="/schools/{$page.params.school_id}" {options}></Aside>
<slot />
