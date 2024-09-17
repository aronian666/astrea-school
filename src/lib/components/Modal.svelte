<script lang="ts">
  import { Icon } from ".";

  import { onMount } from "svelte";

  export let onClose: (() => void) | undefined = undefined;
  export let onOpen: (() => void) | undefined = undefined;
  export let id: string;
  let dialog: HTMLDialogElement;
  onMount(() => {
    if (onClose) dialog.addEventListener("close", onClose);
    if (onOpen) dialog.addEventListener("open", onOpen);
    return () => {
      if (onClose) dialog.removeEventListener("close", onClose);
      if (onOpen) dialog.removeEventListener("open", onOpen);
    };
  });
</script>

<dialog bind:this={dialog} {id}>
  <slot {dialog} />
  <button
    data-shape="square"
    data-size="small"
    data-style="text"
    data-radius="circle"
    style="position: absolute; top: var(--size70); right: var(--size70)"
    on:click={() => dialog.close()}
  >
    <Icon icon="ph:x" active="bold" />
  </button>
</dialog>
