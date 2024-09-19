<script lang="ts">
  import { page } from "$app/stores";
  import { DateManager, Graph, Pagination, Table } from "$lib/components";
  import { DATE_TO_GROUP, ExtendedDate, formatNumber } from "$lib/utils";

  export let data;
  $: value =
    $page.url.searchParams.get("value") || new ExtendedDate().toInput();
</script>

<DateManager />

<section class="grid auto-fill gap3">
  <Graph
    type="line"
    labels={data.group_orders.map(({ interval }) =>
      new ExtendedDate(interval).toIntl(DATE_TO_GROUP[value.length].intl),
    )}
    datasets={[
      {
        label: "Total",
        data: data.group_orders.map(({ sum }) => sum),
        borderColor: "hsl(250, 100%, 65%)",
        tension: 0.4,
      },
    ]}
  ></Graph>
  <Graph
    type="line"
    labels={data.group_orders.map(({ interval }) =>
      new ExtendedDate(interval).toIntl(DATE_TO_GROUP[value.length].intl),
    )}
    datasets={[
      {
        label: "Numero de boletas",
        data: data.group_orders.map(({ count }) => count),
        borderColor: "hsl(128, 90%, 40%)",
        tension: 0.4,
      },
    ]}
  ></Graph>
  <Graph
    type="doughnut"
    labels={data.group_payments.map(({ name }) => name)}
    datasets={[
      { data: data.group_payments.map(({ sum }) => sum), label: "Valor" },
    ]}
  ></Graph>
  <div class="flex direction">
    <Table array={data.group_payments} let:item>
      <tr>
        <td>{item.name}</td>
        <td class="tright">{formatNumber(item.sum)}</td>
      </tr>
      <tfoot slot="tfoot">
        <tr>
          <td><b>TOTAL</b></td>
          <td class="tright">
            <b
              >{formatNumber(
                data.group_payments.reduce((a, b) => a + b.sum, 0),
              )}</b
            >
          </td>
        </tr>
      </tfoot>
    </Table>
  </div>
</section>

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
        <small style="font-weight: 400;">
          {item.class_person.person.first_name}
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
    <td class="tright"> {formatNumber(item.total_value)} </td>
  </tr>
</Table>

{#if data.count}
  <Pagination count={data.count} />
{/if}
