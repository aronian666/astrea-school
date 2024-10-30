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
  let insert_cart: TablesInsert<"carts"> = {
    class_person_id: data.class_person.id,
    concept_id: 0,
  };
  let payments: TablesInsert<"payments">[];
  $: concept =
    data.concepts.find((c) => c.id === insert_cart.concept_id) ||
    data.concepts[0];
  let copy_insert_cart = structuredClone(insert_cart);
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
      data-focus="outline"
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
          {#if cart.middle_date}
            <small>
              {new ExtendedDate(cart.middle_date).toIntl({
                month: "long",
              })}
            </small>
          {/if}
        </hgroup>
        <div class="flex gap1 items content" style="--i: center; --c: center">
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
            class="gap1 menu"
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
            <Button
              data-style="text"
              style="--c: start"
              on:click={() =>
                (insert_cart = {
                  id: Number(cart.id),
                  class_person_id: Number(cart.class_person_id),
                  concept_id: Number(cart.concept_id),
                  discount_id: cart.discount_id,
                  last_date: cart.last_date,
                })}
              onclick="add_cart.showModal()"
            >
              <Icon icon="ph:pen" />
              Editar
            </Button>
          </section>
        </div>
      </section>
      {#if cart.discount || cart.penalty}
        <section class="flex gap1" style="--i: center">
          {#if cart.discount}
            <button
              data-size="small"
              data-style="tonal"
              style="--color: var(--green)"
              >{cart.discount?.name}
            </button>
          {/if}
          {#if cart.penalty}
            <button
              data-size="small"
              data-style="tonal"
              style="--color: var(--red)"
            >
              {formatNumber(cart.penalty)}
            </button>
          {/if}
        </section>
      {/if}
    </label>
  {/each}
</section>

<Modal
  id="add_cart"
  let:dialog
  onClose={() => (insert_cart = structuredClone(copy_insert_cart))}
>
  <Form
    let:loading
    onSubmit={async (e) => {
      let err;
      if (insert_cart.id) {
        err = (
          await data.supabase
            .from("carts")
            .update(setNull(insert_cart))
            .eq("id", insert_cart.id)
        ).error;
      } else {
        err = (await data.supabase.from("carts").insert(setNull(insert_cart)))
          .error;
      }
      if (err) return message.set(err);
      await invalidate("update:carts");
      dialog.close();
    }}
  >
    <h2>
      {#if insert_cart.id}
        Actualizar carrito
      {:else}
        Agregar carrito
      {/if}
    </h2>
    <section class="grid gap3">
      {#if !insert_cart.id}
        <label>
          <span>Producto</span>
          <select bind:value={insert_cart.concept_id}>
            {#each data.concepts as concept (concept.id)}
              <option value={concept.id}>{concept.name}</option>
            {/each}
          </select>
        </label>
      {/if}
      {#if concept.discounts.length}
        <label>
          <span>Descuento</span>
          <select bind:value={insert_cart.discount_id}>
            <option value="null"></option>
            {#each concept.discounts as discount (discount.id)}
              <option value={discount.id}>{discount.name}</option>
            {/each}
          </select>
        </label>
      {/if}
      {#if insert_cart.id}
        <label>
          <span>Ultimo dia de pago</span>
          <input type="date" bind:value={insert_cart.last_date} />
        </label>
      {/if}
    </section>
    <button>
      <Icon {loading} />
      {#if insert_cart.id}
        Actualizar
      {:else}
        Agregar
      {/if}
    </button>
  </Form>
</Modal>

<Modal id="sell" let:dialog>
  <Form
    let:loading
    onSubmit={async () => {
      insert_order.person_id = Number(person.id);
      if (insert_order.created_at === "") insert_order.created_at = undefined;
      const { data: new_order, error: err } = await data.supabase
        .from("orders")
        .insert(insert_order)
        .select("id, created_at")
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
          created_at: new_order.created_at,
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
    <label>
      <span>Fecha de pago</span>
      <input type="datetime-local" bind:value={insert_order.created_at} />
    </label>
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
