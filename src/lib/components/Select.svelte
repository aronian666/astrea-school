<script lang="ts">
  import Modal from "./Modal.svelte";

  export let value: any = [];
  export let name = "";
  let popoverId = "select_" + Math.round(Math.random() * 10000);
  export let required = false;
  type Type = $$Generic;
  export let array: Type[] = [];
  export let setValues = (item: Type) => {
    //@ts-ignore
    return [item.id, item.name];
  };
  let searched = array;

  export let onSearch = (value: string) => {
    //@ts-ignore
    return array.filter((item) => item.name?.toLowerCase().includes(value.toLowerCase()));
  };
  let type: "checkbox" | "radio" = Array.isArray(value) ? "checkbox" : "radio";
</script>

<input
  type="button"
  value={`${type === "checkbox" ? `${value.length} elementos seleccionados` : array.find((i) => setValues(i)[0] === value) ? setValues(array.find((i) => setValues(i)[0] === value))[1] : ""}`}
  onclick="{popoverId}.showModal()"
  id={name}
/>
<Modal id={popoverId} let:dialog class="direction gap4 flex">
  <section class="direction gap3 flex">
    <input
      type="search"
      placeholder="Buscar..."
      on:input={(e) => {
        const input = e.currentTarget.value;
        if (input) searched = onSearch(input);
        else searched = array;
      }}
      on:keydown
    />
    <div class="flex direction gap1" style="max-height: 50vh; overflow: auto; padding: 0 var(--size0)">
      {#each array as item, index}
        <label class="flex items gap1" style={searched.includes(item) ? "" : "display: none"}>
          {#if type === "radio"}
            <input type="radio" {required} value={setValues(item)[0]} {name} bind:group={value} on:change />
          {:else}
            <input type="checkbox" {required} value={setValues(item)[0]} {name} bind:group={value} on:change />
          {/if}
          <span class="w300">
            {setValues(item)[1]}
          </span>
        </label>
      {/each}
    </div>
  </section>
  <button type="button" on:click={() => dialog.close()}> Aceptar </button>
</Modal>
