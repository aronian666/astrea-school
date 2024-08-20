<script lang="ts">
  import { page } from "$app/stores";

  export let data;
  const urls = [
    { name: "Notas", url: `/classes/${data.clas.id}/courses/${data.class_season_level_course.id}` },
    { name: "Comportamiento", url: `/classes/${data.clas.id}/courses/${data.class_season_level_course.id}/behaviors` },
  ];
</script>

{#if data.class_season_level_course.season_level_course?.behavior}
  <nav class="flex gap1">
    {#each urls as url}
      <a class="button" data-active={url.url === $page.url.pathname} data-size="tiny" data-style="tonal" href={url.url}
        >{url.name}</a
      >
    {/each}
  </nav>
{/if}

<slot />
