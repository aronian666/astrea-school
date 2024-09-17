<script lang="ts">
  import { goto, invalidate } from "$app/navigation";
  import { page } from "$app/stores";
  import { Button, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import type { Tables, TablesInsert } from "$lib/types/supabase";
  import { ExtendedDate, formatNumber, formToJson, setNull } from "$lib/utils";
  import { fade, scale } from "svelte/transition";

  export let data;
  let carts: typeof data.carts = [];
  let concept = data.concepts[0];
  let insert_order: TablesInsert<"orders"> = {
    class_person_id: data.class_person.id,
    person_id: 0,
    user_id: data.session.user.id,
    season_id: Number($page.params.season_id),
  };
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  let payments: TablesInsert<"payments">[];
</script>

<section class="flex content items" style="--c: space-between">
  <hgroup>
    <h2>
      {formatNumber(carts.reduce((a, b) => a + Number(b.final_value), 0))}
    </h2>
    <small>{carts.length} items</small>
  </hgroup>
  <div class="flex gap2">
    <Button
      data-style="gradient"
      onclick="sell.showModal()"
      style="--color: var(--primary)"
    >
      <Icon icon="ph:bag" />
      Pagar
    </Button>
    <Button
      data-style="text"
      onclick="add_cart.showModal()"
      style="--color: var(--primary)"
    >
      Agregar item
    </Button>
  </div>
</section>

<section class="grid auto-fill gap3">
  {#each data.carts as cart, index (cart.id)}
    {@const anchor_id = `anchor${cart.id}`}
    <label
      transition:scale
      class="button flex direction gap3"
      data-style="text"
      data-hover="outline"
      style="--i: normal; --c: normal"
    >
      <input
        type="checkbox"
        data-display="none"
        value={cart}
        bind:group={carts}
      />
      <section class="flex content" style="--c: space-between">
        <hgroup class="grid">
          <h4>
            {cart.concept.name}
          </h4>
          {#if cart.finish}
            <small style="font-size: var(--size90);">
              {new ExtendedDate(cart.finish).toIntl({
                month: "long",
              })}
            </small>
          {/if}
        </hgroup>
        <div class="flex gap0 items content" style="--i: center; --c: center">
          <span>
            {formatNumber(cart.final_value || 0)}
          </span>
          <button
            data-style="text"
            data-shape="square"
            data-size="tiny"
            style="--i: center; anchor-name: --{anchor_id}"
            popovertarget={anchor_id}
          >
            <Icon
              icon="ph:dots-three"
              normal="bold"
              active="bold"
              width="1.75em"
            />
          </button>
          <section
            id={anchor_id}
            class="gap0 menu"
            style="position-anchor: --{anchor_id}; inset-area: bottom span-left; --display: grid"
            popover="auto"
          >
            <Button
              let:loading
              data-style="text"
              style="--c: start"
              onClick={async (e) => {
                e.stopPropagation();
                const { error } = await data.supabase
                  .from("carts")
                  .delete()
                  .eq("id", Number(cart.id));
                if (error) return message.set(error);

                data.carts.splice(index, 1);
                data = data;
              }}
            >
              <Icon icon="ph:trash" {loading} />
              Eliminar
            </Button>
            <button data-style="text" style="--c: start">
              <Icon icon="ph:pen" />
              Editar
            </button>
          </section>
        </div>
      </section>
      {#if cart.discount || cart.penalty}
        <section class="flex gap0" style="--i: center">
          <button
            data-size="tiny"
            data-style="tonal"
            style="--color: var(--green)">{cart.discount?.name}</button
          >
        </section>
      {/if}
    </label>
  {/each}
</section>

<Modal id="add_cart" let:dialog>
  <Form
    let:loading
    onSubmit={async (e) => {
      const formValues = setNull(formToJson(new FormData(e.currentTarget)));
      const { data: new_cart, error: err } = await data.supabase
        .from("carts")
        .insert({
          class_person_id: data.class_person.id,
          concept_id: concept.id,
          ...formValues,
        });

      if (err) return message.set(err);
      await invalidate("update:carts");
      dialog.close();
    }}
  >
    <h2>Agregar al carrito</h2>
    <section class="grid gap3">
      <label>
        <span>Producto</span>
        <select bind:value={concept}>
          {#each data.concepts as concept (concept.id)}
            <option value={concept}>{concept.name}</option>
          {/each}
        </select>
      </label>
      {#if concept.discounts.length}
        <label>
          <span>Descuento</span>
          <select name="discount_id">
            <option value="null"></option>
            {#each concept.discounts as discount (discount.id)}
              <option value={discount.id}>{discount.name}</option>
            {/each}
          </select>
        </label>
      {/if}
    </section>
    <button> <Icon {loading} /> Agregar</button>
  </Form>
</Modal>

<Modal id="sell" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      insert_order.person_id = Number(person.id);
      const { data: new_order, error: err } = await data.supabase
        .from("orders")
        .insert(insert_order)
        .select("id")
        .single();
      if (err) return message.set(err);
      payments = carts.map((cart) => {
        return {
          concept_id: Number(cart.concept_id),
          order_id: new_order.id,
          value: cart.concept.value,
          date: cart.date,
          percent: cart.discount?.value || 0,
          discount_id: cart.discount_id,
          penalty: Number(cart.penalty),
        };
      });
      const { error } = await data.supabase.from("payments").insert(payments);
      if (error) {
        await data.supabase.from("orders").delete().eq("id", new_order.id);
        return message.set(error);
      }
      await data.supabase
        .from("carts")
        .delete()
        .in(
          "id",
          carts.map((c) => Number(c.id)),
        );
      return goto(
        `/schools/${$page.params.school_id}/seasons/${$page.params.season_id}/students/${data.class_person.id}/orders`,
      );
    }}
  >
    <h3>Resumen de venta</h3>
    <Person bind:person />
    <hgroup>
      <h2>
        {formatNumber(carts.reduce((a, b) => a + Number(b.final_value), 0))}
      </h2>
      <small>{carts.length} items</small>
    </hgroup>
    <button type="submit">
      <Icon {loading} />
      Pagar
    </button>
  </Form>
</Modal>
