<script lang="ts">
  type BindLoading<T> = T & {
    currentTarget: EventTarget & HTMLInputElement;
  };
  let loading = false;
  let error = "";
  function setError(input: HTMLInputElement, message = "") {
    input.setCustomValidity(message);
    error = input.validationMessage;
  }
  const setLoading = (l: boolean) => (loading = l);
  function bindLoading<T = Event>(func: (e: BindLoading<T>) => Promise<any>) {
    return async (e: BindLoading<T>) => {
      loading = true;
      await func(e);
      loading = false;
    };
  }
</script>

<fieldset>
  <slot {loading} {setError} {setLoading} {bindLoading} />
  {#if error}
    <small class="flex gap1 items" style="color: var(--red)">
      <iconify-icon icon="ph:warning-circle" width="1em"></iconify-icon>
      {error}
    </small>
  {/if}
</fieldset>
