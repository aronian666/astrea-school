<script>
  import { page } from "$app/stores";

  export let data;
  page;
</script>

<main class="flex direction gap5">
  <h1>Mis cursos</h1>
  <section class="grid gap3 auto-fill">
    {#each Object.entries(data.levels) as [level, class_season_courses]}
      <a class="panel" href="{$page.url.pathname}/levels/{level}">
        <div>
          {level}
        </div>
        <small>{class_season_courses?.length} cursos</small>
      </a>
    {/each}
  </section>
</main>
