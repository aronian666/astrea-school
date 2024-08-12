<script lang="ts">
  import Menu from "$lib/components/Menu.svelte";

  export let data;
  const options = [
    { name: "Cursos", href: "", match: true },
    { name: "Tutoria", href: "behaviors" },
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
