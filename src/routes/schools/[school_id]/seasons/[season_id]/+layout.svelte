<script>
  import { page } from "$app/stores";
  import { Menu } from "$lib/components";
  export let data;
  const options = [
    { href: "", icon: "ph:house", name: "Inicio", match: true },
    { href: "students", icon: "ph:student", name: "Estudiantes" },
    { href: "classes", icon: "ph:building", name: "Clases" },
    { href: "courses", icon: "ph:books", name: "Cursos" },
  ];
</script>

<Menu {options} root="/schools/{data.school_user.school_id}/seasons/{$page.params.season_id}"></Menu>

<slot></slot>
