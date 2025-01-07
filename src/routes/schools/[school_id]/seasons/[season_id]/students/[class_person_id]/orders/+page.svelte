<script lang="ts">
  import { page } from "$app/stores";
  import { Button, Icon, Modal, Table } from "$lib/components";
  import { message } from "$lib/stores/message.js";
  import { ExtendedDate, formatNumber } from "$lib/utils";
  import { groupBy } from "$lib/utils/groupBy.js";
  export let data;
</script>

<section class="grid auto-fill gap3">
  {#each data.orders as order, index (order.id)}
    {@const anchor_id = `anchor${order.id}`}
    <div class="panel flex direction gap2">
      <section class="flex content gap1" style="--c: space-between">
        <hgroup>
          <h4>{order.id}</h4>
          <small
            >{new ExtendedDate(order.created_at).toIntl({
              day: "2-digit",
              year: "numeric",
              month: "2-digit",
            })}</small
          >
        </hgroup>
        <button
          data-size="small"
          data-shape="square"
          data-style="text"
          style="--c: center; anchor-name: --{anchor_id}"
          popovertarget={anchor_id}
        >
          <Icon icon="ph:dots-three" active="bold" normal="bold" />
        </button>
        <div
          id={anchor_id}
          popover="auto"
          style="position-anchor: --{anchor_id}; position-area: bottom span-left; --display: grid"
          class="menu"
        >
          <a
            class="button"
            href="/schools/{$page.params.school_id}/seasons/{$page.params
              .season_id}/orders/{order.id}"
            data-style="text"
            style="--c: start"
            ><Icon icon="ph:printer" /> Imprimir
          </a>
          <Button
            let:loading
            data-style="text"
            style="--c: start"
            onClick={async () => {
              if (!confirm("Esta seguro que desea elimiar esta orden")) return;
              const { error } = await data.supabase
                .from("orders")
                .delete()
                .eq("id", order.id);
              if (error) return message.set(error);
              data.orders.splice(index, 1);
              data = data;
            }}
          >
            <Icon icon="ph:trash" {loading} /> Eliminar
          </Button>
        </div>
      </section>
      <Table array={order.payments} let:item>
        <tr>
          <td>
            {item.concept.name}
            {#if item.middle_date}
              ({new ExtendedDate(item.middle_date).toIntl({ month: "long" })})
            {/if}
          </td>

          <td class="tright">
            {formatNumber(item.final_value)}
          </td>
        </tr>
      </Table>
    </div>
  {/each}
</section>
