<script lang="ts">
  import { page } from "$app/stores";

  export let data;
  $: root = `/schools/${$page.params.school_id}/seasons/${$page.params.season_id}/classes/${$page.params.class_id}`;
  const links = [
    { name: "Estudiantes", path: "", icon: "ph:student" },
    { name: "Cursos", path: "/courses" },
  ];
</script>

<section class="grid gap4">
  <hgroup class="grid">
    <h1>
      {data.class.level?.name}
      {data.class.grade}
      {data.class.section?.name}
    </h1>
    <p class="gray70">{data.class.class_persons.length} estudiantes</p>
  </hgroup>
  <nav class="flex items gap1">
    {#each links as { name, path }}
      {@const finalPath = root + path}
      <a
        data-size="medium"
        data-active={finalPath === $page.url.pathname}
        data-style="tonal"
        class="button"
        href={finalPath}>{name}</a
      >
    {/each}
  </nav>
</section>

<slot />
