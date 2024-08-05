<script lang="ts">
  import { page } from "$app/stores";
  import { Icon, Table } from "$lib/components";

  export let data;
</script>

<main class="flex direction gap5">
  <h1>{data.courses[$page.params.course]?.[0].season_course?.course?.name}</h1>
  <section class="flex direction">
    <Table
      array={data.courses[$page.params.course]}
      let:item
      header={[{ name: "Nivel" }, { name: "Grado" }, { name: "Seccion" }]}
    >
      <tr>
        <td>{item.classes.level?.name}</td>
        <td>{item.classes.grade}</td>
        <td>{item.classes.section?.name}</td>

        <td>
          <a
            class="button"
            data-shape="square"
            data-size="tiny"
            data-style="tonal"
            href="/seasons/{$page.params.season_id}/class_season_courses/{item.id}"
          >
            <Icon icon="ph:notepad" />
          </a>
        </td>
      </tr>
    </Table>
  </section>
</main>
