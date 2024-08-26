<script lang="ts">
  import { page } from "$app/stores";
  import { groupBy } from "$lib/utils/groupBy";

  export let data;
</script>

<h1>{data.clas.level?.name} {data.clas.grade} {data.clas.section?.name}</h1>
{#if $page.url.pathname.split("/").length !== 3}
  <nav style="overflow-x: auto">
    <div class="flex gap1" style="width: max-content;">
      {#each data.clas.class_season_courses || [] as { season_course, id }}
        {@const url = `/classes/${data.clas.id}/courses/${id}`}
        <a
          data-size="tiny"
          style="width: max-content"
          class="button"
          data-style="tonal"
          data-active={$page.url.pathname.startsWith(url)}
          href={url}>{season_course?.course?.name}</a
        >
      {/each}
    </div>
  </nav>
{/if}

<slot />
