<script lang="ts">
  import { Form, Table } from "$lib/components";
  import { debounce } from "$lib/utils";

  export let data;
</script>

<section class="flex direction gap2">
  <Form let:button data-sveltekit-keepfocus data-sveltekit-noscroll data-sveltekit-replacestate class="grid auto-fill">
    <input
      type="search"
      placeholder="Buscar"
      name="search"
      on:input={debounce(() => {
        button.click();
      }, 200)}
    />
  </Form>
  <Table array={data.class_persons} let:item>
    <tr>
      <td>
        <a href="students/{item.id}">
          <hgroup class="grid">
            {item.person?.full_name}
            <small style="color: var(--gray70)">
              {item.class?.level?.name}
              {item.class?.grade}
              {item.class?.section?.name}
            </small>
          </hgroup>
        </a>
      </td>
    </tr>
  </Table>
</section>
