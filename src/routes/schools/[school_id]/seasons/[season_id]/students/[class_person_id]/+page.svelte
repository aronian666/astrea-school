<script lang="ts">
  import { Table } from "$lib/components";
  import { formatNumber } from "$lib/utils/formatNumber.js";

  export let data;
  function setNote(value: number | undefined) {
    if (!value) return "";
    if (value < 11) return "C";
    if (value < 14) return "B";
    if (value < 18) return "A";
    return "AD";
  }
</script>

<main>
  <h1>{data.class_person.person?.full_name}</h1>
  <div>
    {#each data.class_person.class?.class_season_courses || [] as class_season_course}
      <section class="flex direction">
        <h2>{class_season_course.season_course?.course?.name}</h2>
        <Table
          class="bordered"
          array={class_season_course.season_course?.competences}
          header={[{ name: "Competencia" }, ...data.cycles.map((cycle) => ({ name: cycle.name }))]}
          let:item
        >
          <tr>
            <td>{item.name}</td>
            {#each data.cycles as cycle}
              {@const note = data.class_person.notes.find((note) => {
                return (
                  note.class_season_course_id === class_season_course.id &&
                  note.competence_id === item.id &&
                  note.cycle_id === cycle.id
                );
              })}
              <td style={note?.value || 0 >= 10 ? "color: var(--primary)" : "color: var(--red)"}>
                {#if note}
                  {formatNumber(note.value)}
                {/if}
                <span class="w500">
                  {setNote(note?.value)}
                </span>
              </td>
            {/each}
          </tr>
        </Table>
      </section>
    {/each}
  </div>
</main>
