<script lang="ts">
  import { Icon } from "$lib/components";
  import { page } from "$app/stores";
  export let options: AsideOption[];
  export let root: string;
</script>

<aside class="flex direction" data-position="1">
  <div class="flex direction">
    {#each options as option}
      <section class="flex direction gap1">
        {#if option.title}
          <h3>{option.title}</h3>
        {/if}
        <div class="flex direction">
          {#each option.paths as path}
            {@const href = [root, path.href].filter(Boolean).join("/")}
            <a
              {href}
              data-active={path.match ? $page.url.pathname === href : $page.url.pathname.startsWith(href)}
              class="button"
              style="--c: start"
              data-style="text"
              data-shape="menu"
            >
              {#if path.icon}
                <Icon icon={path.icon} normal="light" width="1.5rem" />
              {/if}
              {path.name}
            </a>
          {/each}
        </div>
      </section>
    {/each}
  </div>
</aside>

<footer>
  {#each options as option}
    <section class="grid auto-fit" style="--width:5rem">
      {#each option.paths as path}
        {@const href = [root, path.href].filter(Boolean).join("/")}
        <a
          {href}
          data-active={path.match ? $page.url.pathname === href : $page.url.pathname.startsWith(href)}
          class="button flex direction"
          style="--c: start; gap:0; padding: var(--size0)"
          data-style="text"
          data-shape="padding"
          data-size="small"
        >
          {#if path.icon}
            <Icon icon={path.icon} normal="light" width="1.5rem" />
          {/if}
          <small>
            {path.name}
          </small>
        </a>
      {/each}
    </section>
  {/each}
</footer>

<style>
  aside {
    background-color: var(--white);
  }
  section:not(:last-child) {
    border-bottom: 1px solid var(--gray20);
  }
</style>
