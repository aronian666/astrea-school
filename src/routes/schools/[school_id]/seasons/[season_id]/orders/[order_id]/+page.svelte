<script lang="ts">
  import { goto } from "$app/navigation";
  import { Button, Icon, Modal, Table } from "$lib/components";
  import { ExtendedDate } from "$lib/utils/extendedDate.js";
  import { formatNumber } from "$lib/utils/formatNumber.js";
  function getDateDifference(daysDifference: number, today = new Date()): Date {
    const pastDate: Date = new Date(today);
    pastDate.setDate(today.getDate() - daysDifference);
    return pastDate;
  }
  export let data;
  $: total = data.order.payments.reduce((a, b) => a + Number(b.final_value), 0);
</script>

<main>
  <div id="print" class="grid gap2">
    <hgroup class="flex content" style="--c: space-between">
      <picture style="width: 30px">
        <img src="/images/logosfa.svg" alt="Logo" />
      </picture>
      <div class="flex direction items">
        <p>COLEGIO PARROQUIAL</p>
        <h2 style="font-size: 1rem;">San Francisco de Asis</h2>
        <p>jr. San Martin #154 - tel 051 407129</p>
        <p>PUNO - MELGAR - AYAVIRI</p>
        <p>{data.order.id}</p>
      </div>
      <div></div>
    </hgroup>
    <div class="grid">
      <p class="grid">
        <b>A nombre de </b>
        <i>{data.order.person?.full_name}</i>
      </p>
      <p class="grid">
        <b>DNI</b>
        <i>{data.order.person?.dni}</i>
      </p>
      <p class="grid">
        <b>Fecha</b>
        <i>
          {new ExtendedDate(data.order.created_at).toIntl()}
        </i>
      </p>
      <p class="grid">
        <b> Estudiante</b>
        <i>{data.order.class_person?.person?.full_name}</i>
      </p>
      <p class="grid">
        <b>Clase</b>
        <i>
          {data.order.class_person?.class?.level?.name}
          {data.order.class_person?.class?.area.short_name}
          {data.order.class_person?.class?.section?.name}
        </i>
      </p>
    </div>
    <section class="grid">
      <table>
        <thead>
          <tr>
            <th>Producto</th>
            <th>VAL </th>
            <th>DESC </th>
            <th>Mora</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {#each data.order.payments as payment}
            <tr>
              <td>
                {payment.concept?.name}
                {#if payment.finish}
                  ({new ExtendedDate(payment.finish).toIntl({
                    month: "long",
                  })})
                {/if}
              </td>
              <td>{payment.value.toFixed(2)}</td>
              <td>
                {(payment.value * (payment.percent / 100)).toFixed(2)}
              </td>
              <td>
                {payment.penalty.toFixed(2)}
              </td>
              <td>
                {payment.final_value?.toFixed(2)}
              </td>
            </tr>
          {/each}
        </tbody>
        <tfoot>
          <tr>
            <td class="tcenter" colspan="4">TOTAL</td>
            <td>{formatNumber(total)}</td>
          </tr>
        </tfoot>
      </table>
    </section>
  </div>
  <button on:click={() => window.print()}>Imprimir</button>
</main>

<style>
  #print * {
    font-size: var(--size90) !important;
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto;
  }
  #print td,
  #print th {
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    background-color: var(--white);
    text-transform: uppercase;
    font-weight: 600;
  }
  #print p {
    font-size: 1rem;
    text-transform: uppercase;
    font-weight: 600;
  }
</style>
