<script lang="ts">
  import { page } from "$app/stores";
  import { formToJson } from "$lib/utils";
  type Type = $$Generic;
  export let array: Array<Type> = [];
  export let header: {
    property?: keyof Type;
    name: string;
    class?: string;
  }[] = [];
  const setOrder = (url: URL, property: keyof Type) => {
    const searchParams = new URLSearchParams(url.searchParams);
    const filter = formToJson<tPaginate>(searchParams);
    if (filter.order === property) {
      if (filter.ascending === "false") {
        searchParams.set("ascending", "true");
      } else {
        searchParams.set("ascending", "false");
      }
    }
    searchParams.set("order", property.toString());
    return $page.url.pathname + "?" + searchParams.toString();
  };
  const assignArrow = (url: URL, property?: keyof Type) => {
    if (!property) return "";
    const searchParams = new URLSearchParams(url.searchParams);
    const filter = formToJson<tPaginate>(searchParams);
    if (filter.order === property) {
      if (filter.ascending === "true") return "up";
      return "down";
    }
    return "";
  };
</script>

<table {...$$restProps}>
  {#if header.length}
    <thead>
      <tr>
        {#each header as { name, property, class: c }}
          <th data-order={assignArrow($page.url, property)} class={c}>
            {#if property}
              <a href={setOrder($page.url, property)}>
                {name}
              </a>
            {:else}
              {name}
            {/if}
          </th>
        {/each}
      </tr>
    </thead>
  {/if}
  <tbody>
    {#each array as item, i}
      <slot {item} index={Number(i)} />
    {/each}
  </tbody>
  <slot name="tfoot" />
</table>
