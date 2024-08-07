<script lang="ts">
  import Algo from "./Algo.svelte";

  export let data;
</script>

{#if data.session && data.class_season_courses && data.school_users}
  {@const seasons = Object.groupBy(data.class_season_courses, ({ season_course }) =>
    JSON.stringify(season_course?.season),
  )}
  {@const courses = Object.groupBy(data.class_season_courses, ({ season_course }) =>
    JSON.stringify(season_course?.course),
  )}
  <section class="grid gap2">
    <hgroup class="flex content" style="--c: space-between">
      <h2>Instituciones</h2>
    </hgroup>
    <div class="grid auto-fill gap2">
      {#each Object.entries(seasons) as [season_string, class_season_courses]}
        {@const season = JSON.parse(season_string)}
        <a class="panel flex direction gap0" href="/seasons/{season?.id}">
          <hgroup>
            <h4>
              {season?.name}
            </h4>
            <small style="color: var(--gray60)">{season.school?.name}</small>
          </hgroup>
          <p>{class_season_courses?.length} cursos</p>
        </a>
      {/each}
    </div>
  </section>
{:else}
  <Algo />
{/if}
