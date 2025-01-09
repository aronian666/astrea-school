<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { DateManager, Graph, Pagination, Table } from "$lib/components";
  import { message } from "$lib/stores/message.js";
  import {
    DATE_TO_GROUP,
    downloadCSV,
    ExtendedDate,
    Filter,
    formatNumber,
  } from "$lib/utils";

  export let data;
  $: value = $page.url.searchParams.get("value") || "";
  async function download() {
    const months = [
      "marzo",
      "abril",
      "mayo",
      "junio",
      "julio",
      "agosto",
      "septiembre",
      "octubre",
      "noviembre",
      "diciembre",
    ];
    const today = new ExtendedDate();
    const tomorrow = new ExtendedDate();
    tomorrow.setDate(today.getDate() + 1);
    let start: Date, end: Date;
    if (value) [start, end] = ExtendedDate.getRanges(value);
    else
      [start, end] = [
        new Date($page.url.searchParams.get("start") || today),
        new Date($page.url.searchParams.get("end") || tomorrow),
      ];

    const { data: orders, error: err } = await data.supabase
      .from("orders")
      .select(
        "*, person:persons(full_name, dni), class_person:class_persons!inner(class:classes(level:levels(name), area:areas!inner(short_name), section:sections(name)),person:persons!inner(dni, full_name,first_name, last_name1, last_name2)), payments(value, penalty, percent, final_value, concept_id, middle_date)",
        { count: "exact" },
      )
      .eq("season_id", $page.params.season_id)
      .gte("created_at", start.toISOString())
      .lte("created_at", end.toISOString());
    if (err) return message.set(err);
    const rows = orders.map((row) => {
      const payments = [3, 7, 5, 6, 4, 1].map((concept_id) => {
        const vp = row.payments.filter((vp) => concept_id === vp.concept_id);
        if (vp.length === 0) return [0];
        if (concept_id === 1) {
          return months.map((month) => {
            const find_month = vp.find(({ middle_date }) => {
              const payment_month = new ExtendedDate(
                String(middle_date),
              ).toIntl({
                month: "long",
              });
              return month === payment_month;
            });
            if (find_month)
              return [
                (find_month.value * (1 - find_month.percent / 100)).toFixed(2),
                Number(find_month.penalty),
              ];
            return [0, 0];
          });
        }
        return vp.map(({ final_value }) => Number(final_value));
      });
      return [
        row.id,
        new ExtendedDate(row.created_at).toIntl({
          month: "2-digit",
          year: "2-digit",
          day: "2-digit",
        }),
        row.class_person?.class?.level?.name,
        row.class_person?.class?.area.short_name,
        row.class_person?.class?.section?.name,
        row.class_person?.person?.dni,
        row.class_person?.person?.full_name,
        row.person?.dni,
        row.person?.full_name,
        ...payments,
      ].flat();
    });
    const head = [
      "Voleta",
      "Fecha",
      "Nivel",
      "Grado",
      "Seccion",
      "Dni Estudiante",
      "Estudiante",
      "DNI pagante",
      "Pagante",
      "Inscripcion",
      "Cuota de ingreso nuevo",
      "Material",
      "Agenda",
      "Matricula",
      "Marzo",
      "Mora",
      "Abril",
      "Mora",
      "Mayo",
      "Mora",
      "Junio",
      "Mora",
      "Julio",
      "Mora",
      "Agosto",
      "Mora",
      "Septiembre",
      "Mora",
      "Octubre",
      "Mora",
      "Noviembre",
      "Mora",
      "Diciembre",
      "Mora",
    ];
    downloadCSV([head, ...rows], `Estudiantes`);
  }
</script>

<section class="flex content" style="--c: space-between">
  <DateManager />
  <button
    on:click={download}
    data-style="gradient"
    style="--color: var(--primary)">Descargar</button
  >
</section>

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
            <b>
              {formatNumber(data.group_payments.reduce((a, b) => a + b.sum, 0))}
            </b>
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
        <small>
          {item.class_person.person.first_name}
        </small>
      </a>
    </td>
    <td>
      <div class="grid">
        <span>{item.class_person.class.level?.name}</span>
        <small
          >{item.class_person.class.area?.short_name}
          {item.class_person.class.section?.name}</small
        >
      </div>
    </td>
    <td>
      <div class="grid">
        <span>{hour}</span>
        <small>{date}</small>
      </div>
    </td>
    <td class="tright"> {formatNumber(item.total_value)} </td>
  </tr>
</Table>

{#if data.count}
  <Pagination count={data.count} />
{/if}
