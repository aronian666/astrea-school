<script lang="ts">
  import { page } from "$app/stores";
  import { ExtendedDate } from "$lib/utils";
  import Fieldset from "./Fieldset.svelte";
  import Form from "./Form.svelte";
  type Input = "year" | "week" | "month" | "date";
  export let name = "value";
  const inputs: {
    name: string;
    input: Input;
    length: number;
  }[] = [
    {
      name: "Anio",
      input: "year",
      length: 4,
    },
    {
      name: "Mes",
      input: "month",
      length: 7,
    },
    {
      name: "Semana",
      input: "week",
      length: 8,
    },
    {
      name: "Dia",
      input: "date",
      length: 10,
    },
  ];
  const current_date = new ExtendedDate();
  let value =
    $page.url.searchParams.get("value") || current_date.toInput("date");
  let selected = inputs.find(({ length }) => length === value.length)!;
</script>

<Form
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  data-sveltekit-replacestate
  let:button
  {...$$restProps}
>
  <div class="flex gap1">
    {#each inputs as input}
      <button
        on:click={(e) => {
          selected = input;
          value = current_date.toInput(selected.input);
        }}
        data-style="tonal"
        data-active={selected.input == input.input}
      >
        {input.name}
      </button>
    {/each}
  </div>
  <label>
    {#if selected.input === "year"}
      <select {name} {value} on:change={() => button.click()}>
        {#each Array(5)
          .fill(0)
          .map( (_, index) => (new Date().getFullYear() - index).toString(), ) as item}
          <option value={item}>{item}</option>
        {/each}
      </select>
    {:else}
      <input
        {name}
        class="size1"
        type={selected.input}
        {value}
        on:change={() => button.click()}
      />
    {/if}
  </label>
</Form>
