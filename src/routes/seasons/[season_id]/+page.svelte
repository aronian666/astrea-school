<script>
  import { page } from "$app/stores";
  import { BreadCrumb, Icon, Table } from "$lib/components";

  export let data;
</script>

<section class="flex direction gap3">
  {#each data.season.season_levels as season_level}
    {#if season_level.season_level_courses.length}
      <div class="panel flex direction gap2">
        <h3 class="tcenter">{season_level.level?.name}</h3>
        <Table array={season_level.season_level_courses} let:item>
          {#each item.class_season_level_courses as class_season_level_course}
            <tr>
              <td>{class_season_level_course.season_level_course?.course?.name}</td>
              <td class="tcenter">{class_season_level_course.class?.level?.name}</td>
              <td class="tcenter">{class_season_level_course.class?.grade}</td>
              <td class="tcenter">{class_season_level_course.class?.section?.name}</td>
              <td>
                <div class="flex items content">
                  <a
                    class="button"
                    data-shape="square"
                    data-size="tiny"
                    data-style="tonal"
                    href="/seasons/{$page.params.season_id}/class_season_courses/{class_season_level_course.id}"
                  >
                    <Icon icon="ph:notepad" />
                  </a>
                </div>
              </td>
            </tr>
          {/each}
        </Table>
      </div>
    {/if}
  {/each}
</section>
