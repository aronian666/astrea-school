<script lang="ts">
  export let data;
</script>

<section class="flex direction gap1">
  <h1>Tutoria</h1>
  <section class="grid gap1 auto-fill">
    {#each data.classes as clas}
      <a href="/behaviors/{clas.id}" class="panel">
        <h4>
          {clas.level?.name}
          {clas.grade}
          {clas.section?.name}
        </h4>
      </a>
    {/each}
  </section>
</section>
