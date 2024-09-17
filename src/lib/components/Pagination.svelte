<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "./Icon.svelte";
  export let count: number;
  const perPage = 10;
  const maxPages = 3;
  $: number = Number($page.url.searchParams.get("page"));

  const href = (url: URL, page: number) => {
    const searchParams = new URLSearchParams(url.searchParams);
    searchParams.set("page", page.toString());
    return $page.url.pathname + "?" + searchParams.toString();
  };
  $: pages = Math.ceil(count / perPage);
  $: showPages = Math.min(maxPages, pages);
  $: rest = Array(showPages)
    .fill(0)
    .map((a, index) => {
      const half = Math.floor(showPages / 2);
      const lowerDifferencial = Math.max(half - number, 0);
      const upperDiferencial = Math.min(
        pages - number - Math.round(showPages / 2),
        0,
      );
      return index - half + lowerDifferencial + upperDiferencial;
    });
</script>

<section class="flex gap2 items content" style="place-content: space-between;">
  <div class="flex gap1 items">
    {#if number > 0 && showPages === maxPages}
      <a
        href={href($page.url, 0)}
        data-shape="square"
        class="button"
        data-style="tonal"
        data-size="medium"
        data-sveltekit-noscroll
      >
        <Icon icon="iconamoon:arrow-left-2" />
      </a>
    {/if}

    {#each rest as p}
      <a
        class="button"
        data-style="tonal"
        data-active={number === number + p}
        href={href($page.url, number + p)}
        data-sveltekit-noscroll
        data-shape="square"
        data-size="medium"
      >
        {number + p + 1}
      </a>
    {/each}

    {#if number < pages - 1 && showPages === maxPages}
      <a
        class="button"
        data-style="tonal"
        data-shape="square"
        href={href($page.url, pages - 1)}
        data-sveltekit-noscroll
        data-size="medium"
      >
        <Icon icon="iconamoon:arrow-right-2" />
      </a>
    {/if}
  </div>
  <small>{count} registros</small>
</section>
