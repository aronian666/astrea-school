<script lang="ts">
  import { Icon, Table } from "$lib/components";
  import { formatNumber } from "$lib/utils/formatNumber.js";
  import { groupBy } from "$lib/utils/groupBy";
  import { setColor, setNote } from "$lib/utils/models.js";

  export let data;
  let cycle = data.class_person.class?.season?.cycles[1].id;
  const courses = groupBy(data.class_person.class.class_season_courses, ({ season_course }): string => {
    //@ts-ignore
    if (season_course?.course?.course) return String(season_course?.course?.course.name);
    return String(season_course?.course?.name);
  });
</script>

<section class="grid gap1">
  <form class="grid auto-fill gap0" style="--width: 10rem">
    {#each data.class_person.class?.season?.cycles || [] as c}
      <label>
        <input type="radio" data-display="hidden" bind:group={cycle} value={c.id} />
        {c.id}
        {c.name}
      </label>
    {/each}
  </form>
  <button type="button" on:click={() => window.print()} data-style="gradient">
    <Icon icon="ph:printer" /> Imprimir
  </button>
</section>

<div id="print" class="flex direction gap4">
  <section class="flex items content" style="--c: space-around">
    <picture style="width: 5rem;">
      <img src="/images/sfa.svg" alt="" />
    </picture>
    <section class="flex direction gap3">
      <h2 class="tcenter">Libreta de notas del educando</h2>
      <div class="grid gap0" style="grid-template-columns: 1fr 2fr;">
        <b>NOMBRE</b>
        <span>{data.class_person.person?.full_name}</span>
        <b>NIVEL</b>
        <span>{data.class_person.class.level?.name}</span>
        <b>GRADO</b>
        <span>{data.class_person.class.grade}</span>
        <b>SECCION</b>
        <span>{data.class_person.class.section?.name}</span>
      </div>
    </section>
    <picture style="width: 5rem;">
      <img src="/images/logosfa.svg" alt="" />
    </picture>
  </section>
  <div class="flex direction gap3">
    {#each Object.entries(courses) as [course, class_season_courses]}
      {@const competences = (class_season_courses || [])
        .map(({ season_course }) => (season_course || { competences: [] }).competences)
        .flat()}
      {@const all_notes = data.class_person.notes.filter(
        (n) => n.cycle_id === cycle && (class_season_courses || []).some(({ id }) => id === n.class_season_course_id),
      )}
      {@const unique_competences = competences
        .filter((item, index, self) => index === self.findIndex((t) => t.id === item.id))
        .sort((a, b) => a.id - b.id)}
      <section class="flex direction">
        <table class="bordered">
          <thead>
            <tr>
              <th>{course}</th>
              {#each unique_competences as competence, index}
                <th style="width: 6.5rem; font-weight: 400; font-size: var(--small)">COM {index + 1}</th>
              {/each}
              <th style="width: 6.5rem;">Numeral</th>
            </tr>
          </thead>
          <tbody>
            {#each class_season_courses?.sort((a, b) => a.id - b.id) || [] as class_season_course, index}
              {@const notes = all_notes.filter((n) => n.class_season_course_id === class_season_course.id)}
              {@const average = Math.round(notes.reduce((a, b) => a + b.value, 0) / notes.length)}
              <tr>
                <td>
                  {class_season_course.season_course?.course?.name}
                </td>
                {#each unique_competences as competence}
                  {@const note = notes.find(({ competence_id }) => competence_id === competence.id)}

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
</div>

<style>
  table td:not(:first-of-type) {
    text-align: center;
  }
  table thead th:first-of-type {
    text-align: left;
  }
</style>
