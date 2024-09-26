<script lang="ts">
  import { Table } from "$lib/components";

  export let data;
</script>

<section>
  <Table array={data.season.season_persons} let:item>
    <tr>
      <td>{item.person.full_name}</td>
      <td>{item.role.name}</td>
    </tr>
  </Table>
</section>
