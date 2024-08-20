<script>
  export let data;
</script>

<section class="grid gap1 auto-fill">
  {#each data.clas.class_season_level_courses as { season_level_course, id }}
    <a href="/classes/{data.clas.id}/courses/{id}" class="panel">
      <h3>
        {season_level_course?.course?.name}
      </h3>
    </a>
  {/each}
</section>
