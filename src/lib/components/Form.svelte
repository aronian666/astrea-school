<script lang="ts">
  let loading = false;
  export let onSubmit:
    | ((event: SubmitEvent & { currentTarget: EventTarget & HTMLFormElement }) => Promise<any>)
    | undefined = undefined;
  let button: HTMLButtonElement;
</script>

<form
  on:submit
  on:submit={async (e) => {
    if (!onSubmit) return;
    e.preventDefault();
    loading = true;
    await onSubmit(e);
    loading = false;
  }}
  {...$$restProps}
>
  <button bind:this={button} type="submit" style="display: none" />
  <slot {loading} {button} />
</form>
