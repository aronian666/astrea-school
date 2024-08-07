<script lang="ts">
  export let origin = "";
  export let paths: { name: string; path: string }[];
</script>

<nav>
  {#each paths as path, index}
    <a
      href="{origin}/{paths
        .slice(0, index)
        .map(({ path }) => path)
        .join('/')}"
    >
      {path.name}
    </a>
  {/each}
</nav>

<style>
  a:not(:last-child):after {
    content: "/";
  }
  a {
    font-size: var(--small);
  }
  a:hover {
    text-decoration: underline;
  }
</style>
