<script lang="ts">
  import { Table } from "$lib/components";
  import { formatNumber } from "$lib/utils/formatNumber.js";
  import { setColor, setNote } from "$lib/utils/models.js";

  export let data;
  let cycle = data.class_person.class?.season?.cycles[0].id;
  const courses = Object.groupBy(data.class_person.class.class_season_courses, ({ season_course }): string => {
    //@ts-ignore
    if (season_course?.course?.course) return String(season_course?.course?.course.name);
    return String(season_course?.course?.name);
  });
</script>

<main class="flex direction gap5">
  <h1>{data.class_person.person?.full_name}</h1>
  <form class="flex wrap gap1">
    {#each data.class_person.class?.season?.cycles || [] as c}
      <label>
        <input type="radio" data-display="hidden" bind:group={cycle} value={c.id} />
        {c.id}
        {c.name}
      </label>
    {/each}
  </form>
  <div id="print" class="flex direction gap4">
    {#each Object.entries(courses) as [course, class_season_courses]}
      {@const competences = (class_season_courses || [])
        .map(({ season_course }) => (season_course || { competences: [] }).competences)
        .flat()}
      {@const all_notes = (class_season_courses || [])
        .map(({ notes }) => notes)
        .flat()
        .filter(({ cycle_id }) => cycle === cycle_id)}
      {@const unique_competences = competences
        .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        .sort((a, b) => a.id - b.id)}
      <section class="flex direction">
        <table class="bordered">
          <thead>
            <tr>
              <th>{course}</th>
              {#each unique_competences as competence}
                <th style="font-weight: 400; font-size: var(--small)">{competence?.name}</th>
              {/each}
              <th>Numeral</th>
            </tr>
          </thead>
          <tbody>
            {#each class_season_courses?.sort((a, b) => a.id - b.id) || [] as class_season_course, index}
              {@const notes = class_season_course.notes.filter(({ cycle_id }) => cycle === cycle_id)}
              {@const average = Math.round(notes.reduce((a, b) => a + b.value, 0) / notes.length)}
              <tr>
                <td>
                  {class_season_course.season_course?.course?.name}
                </td>
                {#each unique_competences as competence}
                  {@const note = class_season_course.notes.find(
                    ({ competence_id, cycle_id }) => competence_id === competence.id && cycle === cycle_id,
                  )}

                  <td style="color: {setColor(note?.value)}">{note?.value ?? ""}</td>
                {/each}
                <td class="w500" style="color: {setColor(average)}">{average}</td>
              </tr>
            {/each}
            <tr class="w500">
              <td> Promedio </td>
              {#each unique_competences as competence}
                {@const notes = all_notes.filter(({ competence_id }) => competence.id === competence_id)}
                {@const average = Math.round(notes.reduce((a, b) => a + b.value, 0) / notes.length)}
                <td style="color: {setColor(average)}">
                  {average}
                  {setNote(average)}
                </td>
              {/each}
              <td>{Math.round(all_notes.reduce((a, b) => a + b.value, 0) / all_notes.length)}</td>
            </tr>
          </tbody>
        </table>
      </section>
    {/each}
  </div>
</main>
