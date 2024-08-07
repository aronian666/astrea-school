<script lang="ts">
  import { page } from "$app/stores";
  import { Icon } from "$lib/components/index.js";
  import { formatNumber } from "$lib/utils/formatNumber.js";
  export let data;
</script>

<section class="grid gap2 auto-fill">
  {#each data.seasons as season}
    <a
      class="panel flex auto-fit wrap"
      style="--gap: var(--size3)"
      href="/schools/{$page.params.school_id}/seasons/{season.id}"
    >
      <h3 style="--max: 100%" class="tcenter">{season.name}</h3>
      <div style="--min: 5rem" class="grid content items gap0">
        <Icon icon="ph:student" width="1.5rem" />
        {season.count}
      </div>
      <div style="--min: 5rem" class="grid content items gap0">
        <Icon icon="ph:currency-dollar" width="1.5rem" active="bold" />
        {formatNumber(season.sum)}
      </div>
    </a>
  {/each}
</section>
