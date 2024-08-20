<script lang="ts">
  import { groupBy } from "$lib/utils/groupBy";

  export let data;
  const levels = groupBy(data.class_season_level_courses, ({ class: clas }) => JSON.stringify(clas?.level));
</script>

{#each Object.entries(levels) as [level_string, class_season_level_courses]}
  {@const classes = groupBy(class_season_level_courses, ({ class: clas }) => JSON.stringify(clas))}
  {@const level = JSON.parse(level_string)}
  <section class="grid gap2">
    <hgroup class="flex content" style="--c: space-between">
      <h2>{level.name}</h2>
    </hgroup>
    <div class="grid auto-fill gap2">
      {#each Object.entries(classes) as [class_string, class_season_level_courses]}
        {@const clas = JSON.parse(class_string)}
        <a class="panel flex direction gap0" href="/classes/{clas.id}">
          <hgroup>
            <h4>
              {clas.grade}
              {clas.section.name}
            </h4>
          </hgroup>
          <small style="color: var(--gray70)">{class_season_level_courses?.length} cursos</small>
        </a>
      {/each}
    </div>
  </section>
{/each}
