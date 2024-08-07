<script lang="ts">
  import { Table } from "$lib/components/index.js";

  export let data;
</script>

<section>
  <Table array={data.class_person.orders} let:item={order}>
    <tr>
      <td>{order.created_at}</td>
    </tr>
  </Table>
</section>
