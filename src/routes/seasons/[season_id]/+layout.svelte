<script lang="ts">
  import Menu from "$lib/components/Menu.svelte";

  export let data;
  const options = [
    { name: "Todos", href: "", match: true },
    ...Object.keys(data.levels).map((level) => ({ name: level, href: `levels/${level}` })),
  ];
</script>

<hgroup>
  <h1>
    {data.season.name}
  </h1>
  <small>{data.season.school?.name}</small>
</hgroup>

<Menu {options} root="/seasons/{data.season.id}" />

<slot></slot>
