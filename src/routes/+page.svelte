<script lang="ts">
  import { Icon } from "$lib/components";
  import { groupBy } from "$lib/utils/groupBy";
  import Algo from "./Algo.svelte";
  export let data;
</script>

{#if data.session && data.class_season_level_courses}
  {@const levels = groupBy(data.class_season_level_courses, ({ class: clas }) => JSON.stringify(clas?.level))}
  {#if !data.session.user.user_metadata.dni}
    <section class="panel flex items gap0">
      <iconify-icon style="color: orange" width="1.5rem" icon="ph:warning" />
      <span>
        Para ver sus cursos debera asignar un <b>DNI</b>, agregelo
        <a style="color: var(--primary)" href="/profile">aquí</a>.
      </span>
    </section>
  {:else}
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
  {/if}
{:else}
  <Algo />
{/if}
