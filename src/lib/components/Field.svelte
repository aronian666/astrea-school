<script lang="ts">
  export let label = "";
  export let name = "";
  export let required = false;
  export let value: any = "";
  export let style = "";
  let error: string;
  let loading = false;

  type BindLoading<T> = T & {
    currentTarget: EventTarget & HTMLInputElement;
  };
  function bindLoading<T = Event>(func: (e: BindLoading<T>) => Promise<any>) {
    return async (e: BindLoading<T>) => {
      loading = true;
      await func(e);
      loading = false;
    };
  }
  const setError = (input: HTMLInputElement, err = "") => {
    //input.setCustomValidity(err);
    //error = input.validationMessage;
  };
  const setLoading = (l: boolean) => (loading = l);
</script>

<section class="grid gap1" {style}>
  <slot name="label">
    {#if label}
      <label for={name}>
        {label}
      </label>
    {/if}
  </slot>

  <slot {loading} {bindLoading} {setError} {setLoading}>
    <input
      {name}
      {required}
      on:blur={(e) => setError(e.currentTarget)}
      bind:value
      placeholder={label}
      on:change
      on:input
      on:keydown
      id={name}
      {...$$restProps}
    />
  </slot>

  {#if error}
    <small class="flex items gap2" style="color: var(--red)">
      <iconify-icon icon="ph:warning" style="scale: 1.2"></iconify-icon>
      {error}
    </small>
  {/if}
</section>
