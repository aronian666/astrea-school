<script lang="ts">
  import { Table } from "$lib/components/index.js";
  import { ExtendedDate, formatNumber } from "$lib/utils";

  export let data;
</script>

<section>
  <Table array={data.orders} let:item={order}>
    <tr>
      <td>{new ExtendedDate(order.created_at).toIntl()}</td>
      <td>
        <div class="flex direction gap0">
          {#each order.payments as payment}
            <small>{payment.concept?.name}{formatNumber(payment.final_value)}</small>
          {/each}
        </div>
      </td>
      <td>{formatNumber(order.payments.reduce((a, b) => a + b.final_value, 0))}</td>
    </tr>
  </Table>
</section>
