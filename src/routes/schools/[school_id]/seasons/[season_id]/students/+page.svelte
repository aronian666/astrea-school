<script lang="ts">
  import { Form, Table } from "$lib/components";
  import { debounce } from "$lib/utils";

  export let data;
</script>

<main>
  <h1>Estudiantes</h1>
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
  <section>
    <Table array={data.class_persons} let:item>
      <tr>{item.person?.full_name}</tr>
    </Table>
  </section>
</main>
