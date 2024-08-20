<script lang="ts">
  export let data;
</script>

<section class="flex direction gap0">
  <h1>Tutoria</h1>
  <section class="grid gap1 auto-fill">
    {#each data.classes as clas}
      <a href="/behaviors/{clas.id}" class="panel">
        <h3>
          {clas.level?.name}
          {clas.grade}
          {clas.section?.name}
        </h3>
      </a>
    {/each}
  </section>
</section>
