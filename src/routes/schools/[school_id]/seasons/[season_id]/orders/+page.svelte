<script lang="ts">
  import { Pagination, Table } from "$lib/components";
  import { ExtendedDate, formatNumber } from "$lib/utils";

  export let data;
</script>

<h1>Ventas</h1>

<Table array={data.orders} let:item>
  {@const [date, hour] = new ExtendedDate(item.created_at).toIntl().split(",")}
  <tr>
    <td>
      <a
        href="orders/{item.id}"
        style="font-weight: 600; --color: var(--black);"
        class="grid"
      >
        <span>
          {item.class_person.person.last_name1}
          {item.class_person.person.last_name2}
        </span>
        <small style="font-weight: 400;"
          >{item.class_person.person.first_name}
        </small>
      </a>
    </td>
    <td>
      <div class="grid">
        <span>{hour}</span>
        <span style="color: var(--gray70); font-size: var(--size90);"
          >{date}</span
        >
      </div>
    </td>
    <td class="tright"> Aqui ira el Total </td>
  </tr>
</Table>

{#if data.count}
  <Pagination count={data.count} />
{/if}
