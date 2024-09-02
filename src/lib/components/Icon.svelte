<script lang="ts">
  type Style = "thin" | "light" | "" | "bold" | "doutone" | "fill";
  export let icon: string | undefined | null = "";
  export let normal: Style = "";
  export let active: Style = "fill";
  export let loading = false;
  export let style = "";
  export let width = "1.5em";
</script>

{#if loading}
  <iconify-icon {style} {width} icon="line-md:loading-loop"></iconify-icon>
{:else if icon}
  <iconify-icon {style} {width} data-status="default" icon="{icon}{normal ? `-${normal}` : ''}"></iconify-icon>
  <iconify-icon {style} {width} data-status="active" icon="{icon}{active ? `-${active}` : ''}"></iconify-icon>
{/if}
