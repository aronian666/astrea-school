<script lang="ts">
  import { Icon } from "$lib/components";
  import { groupBy } from "$lib/utils/groupBy";
  import Home from "./Home.svelte";
  export let data;
</script>

{#if data.session}
  <section class="grid gap1 auto-fill">
    <a href="/classes" class="panel"> Clases </a>
    <a href="/" class="panel"> Tutoria </a>
    <a href="/" class="panel"> Asistencia </a>
  </section>
{:else}
  <Home />
{/if}
