<script lang="ts">
  import { Icon, Table } from "$lib/components";

  export let data;
</script>

<section class="flex direction">
  <Table header={[{ name: "Nivel" }, { name: "Grado" }, { name: "Seccion" }]} array={data.season.classes} let:item>
    <tr>
      <td>{item.level?.name}</td>
      <td>{item.grade}</td>
      <td>{item.section?.name}</td>
      <td>
        <a href="behaviors/{item.id}">
          <Icon icon="ph:note" />
        </a>
      </td>
    </tr>
  </Table>
</section>
