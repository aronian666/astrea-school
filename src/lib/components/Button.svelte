<script lang="ts">
  export let loading = false;
  export let onClick:
    | ((
        event: MouseEvent & {
          currentTarget: EventTarget & HTMLButtonElement;
        },
      ) => Promise<any>)
    | undefined = undefined;
</script>

<button
  type="button"
  on:click
  on:click={async (event) => {
    loading = true;
    if (onClick) await onClick(event);
    loading = false;
  }}
  disabled={loading}
  {...$$restProps}
>
  <slot {loading} />
</button>
