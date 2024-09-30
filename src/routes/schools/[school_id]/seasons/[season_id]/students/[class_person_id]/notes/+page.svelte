<script lang="ts">
  import { Icon, Table } from "$lib/components";
  import { formatNumber } from "$lib/utils/formatNumber.js";
  import { groupBy } from "$lib/utils/groupBy";
  import { setColor, setNote } from "$lib/utils/models.js";

  export let data;
  let cycle = data.class_person.class?.season?.cycles[1]!;
  const courses = groupBy(
    data.class_person.class.class_season_courses,
    ({ season_course }): string => {
      //@ts-ignore
      if (season_course?.course?.course)
        return String(season_course?.course?.course.name);
      return String(season_course?.course?.name);
    },
  );
  $: behaviors = data.class_person.behaviors.filter(
    (b) => b.cycle_id === cycle.id,
  );
  $: behavior = Math.round(
    behaviors.reduce((a, b) => a + b.value, 0) / behaviors.length,
  );
</script>

<section class="grid gap1">
  <form class="grid auto-fill gap1" style="--width: 10rem">
    {#each data.class_person.class?.season?.cycles || [] as c}
      <label class="flex items content">
        <input
          type="radio"
          data-display="hidden"
          bind:group={cycle}
          value={c}
        />

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
    <picture style="width: 6rem;">
      <img src="/images/sfa.jpg" alt="" />
    </picture>
    <section class="flex direction gap3">
      <h2 class="tcenter">"BOLETA DE NOTAS DEL EDUCANDO"</h2>
      <div class="grid gap1" style="grid-template-columns: 1fr 2fr;">
        <b>NOMBRE</b>
        <span>{data.class_person.person?.full_name}</span>
        <b>NIVEL</b>
        <span>{data.class_person.class.level?.name}</span>
        <b>GRADO</b>
        <span>{data.class_person.class.grade}</span>
        <b>SECCION</b>
        <span>{data.class_person.class.section?.name}</span>
        <b>BIMESTRE</b>
        <span>{cycle?.name}</span>
        <b>AÑO</b>
        <span>{data.class_person.class.season?.name}</span>
      </div>
    </section>
    <picture style="width: 9rem;">
      <img src="/images/logosfa.svg" alt="" />
    </picture>
  </section>
  <div class="flex direction gap3">
    {#each Object.entries(courses).sort( ([a], [b]) => a.localeCompare(b), ) as [course, class_season_courses]}
      {@const competences = (
        class_season_courses.sort(
          (a, b) =>
            Number(a.season_course?.order) - Number(b.season_course?.order),
        ) || []
      )
        .map(
          ({ season_course }) =>
            (season_course || { competences: [] }).competences,
        )
        .flat()}
      {@const all_notes = data.class_person.notes.filter(
        (n) =>
          n.cycle_id === cycle.id &&
          (class_season_courses || []).some(
            ({ id }) => id === n.class_season_course_id,
          ),
      )}
      {@const unique_competences = competences
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.id === item.id),
        )
        .sort((a, b) => a.id - b.id)}
      <section class="flex direction">
        <table class="bordered">
          <thead>
            <tr>
              <th>{course}</th>
              {#each unique_competences as competence, index}
                <th
                  style="width: 6.5rem; font-weight: 400; font-size: var(--small)"
                  >Comp. {index + 1}</th
                >
              {/each}
              <th style="width: 6.5rem;">Numeral</th>
            </tr>
          </thead>
          <tbody>
            {#each class_season_courses || [] as class_season_course, index}
              {@const notes = all_notes.filter(
                (n) => n.class_season_course_id === class_season_course.id,
              )}
              {@const average = Math.round(
                notes.reduce((a, b) => a + b.value, 0) / notes.length,
              )}
              <tr>
                <td>
                  {class_season_course.season_course?.course?.name}
                </td>
                {#each unique_competences as competence}
                  {@const note = notes.find(
                    ({ competence_id }) => competence_id === competence.id,
                  )}

                  <td style="color: {setColor(note?.value)}"
                    >{note?.value ?? ""}</td
                  >
                {/each}
                <td class="w500" style="color: {setColor(average)}"
                  >{average}</td
                >
              </tr>
            {/each}
            <tr class="w500">
              <td> Literal </td>
              {#each unique_competences as competence}
                {@const notes = all_notes.filter(
                  ({ competence_id }) => competence.id === competence_id,
                )}
                {@const average = Math.round(
                  notes.reduce((a, b) => a + b.value, 0) / notes.length,
                )}
                <td style="color: {setColor(average)}">
                  {setNote(average)}
                </td>
              {/each}
            </tr>
          </tbody>
        </table>
      </section>
    {/each}
  </div>
  <div class="grid content">
    <table class="bordered">
      <thead>
        <tr>
          <th colspan="2">Comportamiento</th>
        </tr>
        <tr>
          <th class="small">Numeral</th>
          <th class="small">Literal</th>
        </tr>
      </thead>
      <tbody>
        <tr style="color: {setColor(behavior)}">
          <td class="tcenter">{behavior}</td>
          <td class="tcenter">{setNote(behavior)}</td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="flex content" style="--c: space-around; margin-top: var(--size5)">
    <small
      style="border-top: 1px solid black; padding: var(--size1) var(--size2); "
      >Firma del docente o tutor(a)</small
    >
    <small
      style="border-top: 1px solid black; padding: var(--size1) var(--size2); "
      >Firma y sello del director(a)</small
    >
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
