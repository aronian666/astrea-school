<script lang="ts">
  import { Icon } from "$lib/components";
  import { groupBy } from "$lib/utils/groupBy";
  import Algo from "./Algo.svelte";

  export let data;
</script>

{#if data.session && data.class_season_courses && data.school_users}
  {@const seasons = groupBy(data.class_season_courses, ({ season_course }) => JSON.stringify(season_course?.season))}
  {#if !data.session.user.user_metadata.dni}
    <section class="panel flex items gap0">
      <iconify-icon style="color: orange" width="1.5rem" icon="ph:warning" />
      <span>
        Para ver sus cursos debera asignar un <b>DNI</b>, agregelo
        <a style="color: var(--primary)" href="/profile">aquí</a>.
      </span>
    </section>
  {:else}
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
  {/if}
{:else}
  <Algo />
{/if}
