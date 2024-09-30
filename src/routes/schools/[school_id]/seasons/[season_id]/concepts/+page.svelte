<script lang="ts">
  import { Button, Form, Icon, Modal, Table } from "$lib/components";
  import Field from "$lib/components/Field.svelte";
  import { message } from "$lib/stores/message";
  import { formatNumber, formToJson } from "$lib/utils";

  export let data;
  let conceptSelected = data.concepts[0];
</script>

<h1>Esta es la tienda</h1>

<section class="grid auto-fill gap3">
  {#each data.concepts as concept}
    <div class="panel flex direction gap3">
      <h3>{concept.name}</h3>
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
                  data-size="tiny"
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
                  style="position-anchor: --{id}; inset-area: bottom span-left; --display: grid; --c: start"
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
        <h4>Moras</h4>
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
    <Field label="Nombre" name="name" required></Field>
    <Field>
      <label for="value">Porcentaje</label>
      <input
        type="number"
        placeholder="0"
        required
        step="0.01"
        name="value"
        id="value"
      />
    </Field>
    <button> Agregar </button>
  </Form>
</Modal>
