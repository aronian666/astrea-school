<script lang="ts">
  import { Button, Form, Icon, Modal, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { formatNumber, formToJson } from "$lib/utils";
  import { page } from "$app/stores";

  export let data;
  let conceptSelected = data.concepts[0];
</script>

<hgroup>
  <h1>Esta es la tienda</h1>
  <Button onclick="add_concept.showModal()">Agregar concepto</Button>
</hgroup>

<section class="grid auto-fill gap3">
  {#each data.concepts as concept, index}
    <div class="panel flex direction gap3">
      <hgroup class="flex content items" style="--c: space-between">
        <h3>{concept.name}</h3>
        <span class="flex items">
          S./ {formatNumber(concept.value)}
          <Button
            data-style="text"
            data-size="small"
            data-shape="square"
            style="--c: center"
            let:loading
            onClick={async () => {
              if (!confirm("¿Estás seguro?")) return;
              const { error } = await data.supabase
                .from("concepts")
                .delete()
                .eq("id", concept.id);
              if (error) return message.set(error);
              data.concepts.splice(index, 1);
              data = data;
            }}
          >
            <Icon icon="ph:trash" {loading} />
          </Button>
        </span>
      </hgroup>
      <section class="flex direction gap1">
        <hgroup class="flex content" style="--c: space-between">
          <h4>Descuentos</h4>
          <Button
            onclick="add_discount.showModal()"
            on:click={() => (conceptSelected = concept)}
            data-size="small"
            data-style="tonal"
            data-shape="square"
            style="font-size: var(--small); --c: center"
          >
            <Icon icon="ph:plus" active="bold" />
          </Button>
        </hgroup>
        <ul class="flex direction gap1">
          {#each concept.discounts as discount, index}
            {@const id = `discount${discount.id}`}
            <li
              class="flex content items"
              style="--c: space-between; font-size: var(--small)"
            >
              <span>
                {discount.name}
              </span>
              <div class="flex gap1 items">
                <span>{formatNumber(discount.value)}%</span>
                <button
                  data-size="small"
                  data-shape="square"
                  data-style="tonal"
                  style="--c: center;anchor-name: --{id};"
                  popovertarget={id}
                >
                  <Icon icon="ph:dots-three" active="bold" />
                </button>
                <div
                  popover="auto"
                  class="panel menu"
                  {id}
                  style="position-anchor: --{id}; position-area: bottom span-left; --display: grid; --c: start"
                >
                  <Button
                    data-style="text"
                    data-size="small"
                    data-shape="menu"
                    onClick={async () => {
                      const { error } = await data.supabase
                        .from("discounts")
                        .delete()
                        .eq("id", discount.id);
                      if (error) return message.set(error);
                      concept.discounts.splice(index, 1);
                      data = data;
                    }}
                  >
                    <Icon icon="ph:pen" />
                    Editar
                  </Button>
                  <Button data-style="text" data-size="small" data-shape="menu">
                    <Icon icon="ph:trash" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </li>
          {/each}
        </ul>
      </section>
      <section>
        <section class="flex">
          <input
            type="checkbox"
            name="starting[{concept.id}]"
            id="starting[{concept.id}]"
            bind:checked={concept.starting}
            on:change={async () => {
              const { error } = await data.supabase
                .from("concepts")
                .update({ starting: concept.starting })
                .eq("id", concept.id);
              console.log(error);
            }}
          />
          <label for="starting[{concept.id}]"> Cuando se crea </label>
        </section>
      </section>
    </div>
  {/each}
</section>

<Modal id="add_discount">
  <Form
    onSubmit={async (e) => {
      const new_discount = formToJson(new FormData(e.currentTarget));
      new_discount.concept_id = conceptSelected.id;
      const { error, data: newDiscount } = await data.supabase
        .from("discounts")
        .insert(new_discount)
        .select()
        .single();
      if (error) return message.set(error);
      conceptSelected.discounts.push(newDiscount);
    }}
  >
    <label>
      <span>Nombre</span>
      <input type="text" name="name" required />
    </label>
    <label>
      <span>Porcentaje</span>
      <input
        type="number"
        placeholder="0"
        required
        step="0.01"
        name="value"
        id="value"
      />
    </label>
    <button> Agregar </button>
  </Form>
</Modal>

<Modal id="add_concept" let:dialog>
  <Form
    onSubmit={async (e) => {
      const { data: new_concept, error } = await data.supabase
        .from("concepts")
        .insert({
          //@ts-ignore
          name: e.currentTarget.name.value,
          value: e.currentTarget.value.value,
          season_id: Number($page.params.season_id),
        })
        .select("*, discounts(*)")
        .single();
      if (error) return message.set(error);
      data.concepts.push(new_concept);
      data = data;
      dialog.close();
    }}
  >
    <label>
      <span>Nombre</span>
      <input type="text" name="name" required />
    </label>
    <label>
      <span>Value</span>
      <input type="number" step="0.01" name="value" required />
    </label>
    <button>Agregar</button>
  </Form>
</Modal>
