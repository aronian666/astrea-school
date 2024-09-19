<script lang="ts">
  import {
    Chart,
    registerables,
    type ChartType,
    type ChartDataset,
  } from "chart.js";

  import { onMount } from "svelte";
  let canvas: HTMLCanvasElement;
  Chart.register(...registerables);
  export let type: ChartType;
  export let datasets: ChartDataset<typeof type>[];
  export let labels: string[];
  let chart: Chart<typeof type>;
  onMount(() => {
    chart = new Chart(canvas, {
      type,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        aspectRatio: 1,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  });
  $: if (chart) {
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
  }
</script>

<div>
  <canvas bind:this={canvas} />
</div>
