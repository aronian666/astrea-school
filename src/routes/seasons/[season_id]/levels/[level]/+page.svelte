<script>
  import { page } from "$app/stores";
  import { Icon, Table } from "$lib/components";

  export let data;
</script>

<section class="flex direction">
  <Table
    array={data.levels[$page.params.level]}
    let:item
    header={[{ name: "Curso" }, { name: "Grado" }, { name: "Seccion" }, { name: "Notas" }]}
  >
    <tr>
      <td>{item.season_course?.course?.name}</td>
      <td class="tcenter">{item.classes.grade}</td>
      <td class="tcenter">{item.classes.section?.name}</td>

      <td>
        <div class="flex items content">
          <a
            class="button"
            data-shape="square"
            data-size="tiny"
            data-style="tonal"
            href="/seasons/{$page.params.season_id}/class_season_courses/{item.id}"
          >
            <Icon icon="ph:notepad" />
          </a>
        </div>
      </td>
    </tr>
  </Table>
</section>
