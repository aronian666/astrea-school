<script lang="ts">
  import { Form, Pagination, Table } from "$lib/components";
  import { debounce } from "$lib/utils";

  export let data;
</script>

<Form
  let:button
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  data-sveltekit-replacestate
  class="grid auto-fill"
>
  <label>
    <span>Buscar</span>
    <input
      type="search"
      placeholder="Buscar"
      name="search"
      on:input={debounce(() => {
        button.click();
      }, 200)}
    />
  </label>
</Form>
<section class="flex direction gap1">
  <Table array={data.class_persons} let:item>
    <tr>
      <td>
        <a
          href="students/{item.id}"
          style="font-weight: 400; color: var(--black)"
        >
          <hgroup class="grid">
            {item.person?.full_name}
            <small style="color: var(--gray70)">
              {item.class.level.name}
              {item.class.grade}
              {item.class.section.name}
            </small>
          </hgroup>
        </a>
      </td>
    </tr>
  </Table>
  {#if data.count}
    <Pagination count={data.count} />
  {/if}
</section>
