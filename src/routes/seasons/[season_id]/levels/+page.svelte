<script>
  export let data;
  const levels = Object.groupBy(data.class_season_courses, ({ classes }) => JSON.stringify(classes.level));
</script>

<main>
  <h1>Niveles educativos</h1>
  <section class="flex direction gap1">
    {#each Object.entries(levels) as [levelString, class_season_courses]}
      {@const level = JSON.parse(levelString)}
      <a class="panel" href="levels/{level?.id}">
        <h3>{level?.name}</h3>
        <small>{class_season_courses?.length}</small>
      </a>
    {/each}
  </section>
</main>
