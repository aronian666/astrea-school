<script lang="ts">
  import { page } from "$app/stores";
  import { Aside } from "$lib/components/index.js";

  export let data;
  const options: AsideOption[] = [
    {
      paths: [
        { href: "", icon: "ph:house", name: "Inicio", match: true },
        { href: "students", icon: "ph:student", name: "Estudiantes" },
        { href: "classes", icon: "ph:building", name: "Clases" },
        { href: "courses", icon: "ph:books", name: "Cursos" },
      ],
    },
  ];
</script>

<Aside root="/schools/{$page.params.school_id}/seasons/{$page.params.season_id}" {options}></Aside>

<slot></slot>
