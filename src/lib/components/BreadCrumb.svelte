<script lang="ts">
  import { page } from "$app/stores";
  export let link: string | undefined = undefined;
  $: paths = (link || $page.url.pathname).split("/").filter(Boolean);
  export let names: Array<string | undefined> = [];
</script>

<ul>
  {#each paths as path, index}
    {#if names.length > 0 && names[index]}
      <li>
        <a href={[$page.url.origin, paths.slice(0, index + 1).join("/")].join("/")}>
          {names[index] || path}
        </a>
      </li>
    {/if}
  {/each}
</ul>

<style>
  ul {
    list-style: none;
    display: flex;
    gap: 0.2rem;
  }
  li:not(:last-child):after {
    content: "/";
  }
  a {
    font-size: 0.9rem;
  }
  a:hover {
    text-decoration: underline;
  }
</style>
