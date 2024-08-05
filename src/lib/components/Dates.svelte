<script lang="ts">
  import { page } from "$app/stores";
  import { ExtendedDate } from "$lib/utils";
  type Input = "year" | "week" | "month" | "date";
  export let name = "date";
  const inputs: {
    name: string;
    input: Input;
    length: number;
  }[] = [
    {
      name: "Dia",
      input: "date",
      length: 10,
    },
    {
      name: "Semana",
      input: "week",
      length: 8,
    },
    {
      name: "Mes",
      input: "month",
      length: 7,
    },
    {
      name: "Anio",
      input: "year",
      length: 4,
    },
  ];
  const current_date = new ExtendedDate();
  let value = $page.url.searchParams.get(name) || current_date.toInput("date");
  let selected = inputs.find(({ length }) => length === value.length)!;
  const years = Array(new Date().getFullYear() - 2023)
    .fill(0)
    .map((_, index) => index + 2024);
</script>

<select
  bind:value={selected}
  on:change={() => {
    value = current_date.toInput(selected.input);
  }}
  on:change
>
  {#each inputs as input}
    <option value={input}>
      {input.name}
    </option>
  {/each}
</select>
{#if selected.input === "year"}
  <select style="flex: 1" {name} on:change>
    {#each years as year}
      <option selected={year.toString() === value} value={year}>{year}</option>
    {/each}
  </select>
{:else}
  <input style="flex: 1;" {name} type={selected.input} {value} on:change />
{/if}
