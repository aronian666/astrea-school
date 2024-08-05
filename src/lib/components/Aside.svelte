<script lang="ts">
  import { Icon } from "$lib/components";
  import { page } from "$app/stores";
  export let options: AsideOption[];
  export let root: string;
</script>

<aside class="flex direction" data-position="1">
  <div class="flex direction">
    {#each options as option}
      <section class="flex direction gap1" style="padding: var(--size1) 0">
        {#if option.title}
          <h3 style="padding-left: var(--size3)">{option.title}</h3>
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

<style>
  aside {
    background-color: var(--white);
  }
  section:not(:last-child) {
    border-bottom: 1px solid var(--gray20);
  }
</style>
