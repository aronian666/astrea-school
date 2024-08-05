<script lang="ts">
  import Algo from "./Algo.svelte";

  export let data;
</script>

{#if data.session && data.seasons && data.school_users}
  <main class="flex direction gap5">
    <section class="grid gap2">
      <hgroup class="flex content" style="--c: space-between">
        <h2>Instituciones</h2>
      </hgroup>
      <div class="grid auto-fill gap2">
        {#each data.seasons as season}
          <a class="panel flex direction gap0" href="/seasons/{season?.id}">
            <hgroup>
              <h3>
                {season?.name}
              </h3>
              <small style="color: var(--gray60)">{season.school.name}</small>
            </hgroup>
            <p>{season.count} cursos</p>
          </a>
        {/each}
      </div>
    </section>
  </main>
{:else}
  <Algo />
{/if}
