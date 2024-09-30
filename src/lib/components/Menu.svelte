<script lang="ts">
  import { page } from "$app/stores";
  export let root: string;
  export let options: { name: string; href: string; match?: boolean }[];
</script>

<nav class="flex gap1">
  {#each options as option}
    {@const href = [root, option.href].filter(Boolean).join("/")}
    <a
      {href}
      class="button"
      data-size="medium"
      data-style="tonal"
      data-active={option.match
        ? $page.url.pathname === href
        : $page.url.pathname.startsWith(href)}>{option.name}</a
    >
  {/each}
</nav>
