<script>
  import { page } from "$app/stores";
  import { Icon, Table } from "$lib/components";

  export let data;
</script>

<main class="flex direction gap5">
  <h1>{data.levels[$page.params.level]?.[0].classes.level?.name}</h1>
  <section class="flex direction">
    <Table
      array={data.levels[$page.params.level]}
      let:item
      header={[{ name: "Curso" }, { name: "Grado" }, { name: "Seccion" }]}
    >
      <tr>
        <td>{item.season_course?.course?.name}</td>
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
