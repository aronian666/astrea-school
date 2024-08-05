<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";
  export let options: tDetailOption[];
  export let origin = "";
  let detailses: HTMLDetailsElement[] = [];
  onMount(() => {
    if (!detailses.length) return;
    const removeCurentOpen = (index: number) => {
      detailses.forEach((details, i) => {
        if (index === i) return;
        detailses[i].removeAttribute("open");
      });
    };
    const events: ((event: MouseEvent) => void)[] = [];
    detailses.forEach((detail, index) => {
      events.push(() => removeCurentOpen(index));
      detail.addEventListener("click", events[index]);
    });
    return () => {
      detailses.forEach((detail, index) => {
        detail.removeEventListener("click", events[index]);
      });
    };
  });
</script>

<div>
  {#each options as { href, icon, name, options: ops, origin: o, match }, index}
    {#if ops}
      <details open={$page.url.pathname.startsWith(`${origin}${o}`)} bind:this={detailses[index]}>
        <summary
          data-active={$page.url.pathname.startsWith(`${origin}${o}`)}
          class="button"
          data-style="text"
          style="place-content: start"
        >
          <Icon {icon} width="1.125rem" normal="light" />
          {name}
        </summary>

        <svelte:self options={ops} origin={`${origin}${o}`}></svelte:self>
      </details>
    {:else}
      {@const active = !match
        ? $page.url.pathname.startsWith(`${origin}${href}`)
        : $page.url.pathname === `${origin}${href}`}
      <a href="{origin}{href}" class="button" style="place-content: start" data-style="text" data-active={active}>
        <Icon {icon} width="1.125rem" normal="light" />
        {name}
      </a>
    {/if}
  {/each}
</div>
