<script>
  import { groupBy } from "$lib/utils/groupBy";

  export let data;
  const courses = groupBy(data.class_season_courses, ({ season_course }) =>
    JSON.stringify(season_course?.course?.name),
  );
</script>

<main>
  <h1>Cursos</h1>
  <section class="flex direction gap1">
    {#each Object.entries(courses) as [courseString, class_season_courses]}
      {@const course = JSON.parse(courseString)}
      <a class="panel" href="courses/{course?.id}">
        <h3>{course?.name}</h3>
        <small>{class_season_courses?.length}</small>
      </a>
    {/each}
  </section>
</main>
