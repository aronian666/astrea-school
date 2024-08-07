<script lang="ts">
  export let data;
</script>

<main class="flex direction gap5">
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
</main>
