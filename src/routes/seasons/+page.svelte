<script lang="ts">
  export let data;
</script>

<main class="flex direction gap5">
  <hgroup>
    <h1>Anios escolares</h1>
  </hgroup>
  <section class="grid gap2 auto-fill" style="grid-auto-rows: 5rem;">
    {#each data.season_users as { season, role }}
      <a href="/seasons/{season?.id}" class="panel">
        <h3>
          {season?.name}
        </h3>
        <small>{role?.name}</small>
      </a>
    {/each}
  </section>
</main>
