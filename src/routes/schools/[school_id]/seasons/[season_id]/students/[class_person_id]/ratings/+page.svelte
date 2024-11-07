<script lang="ts">
  import { page } from "$app/stores";
  import { Form } from "$lib/components";
  import Icon from "$lib/components/Icon.svelte";
  import { groupBy } from "$lib/utils/groupBy";
  import { setColor, setNote } from "$lib/utils/models.js";

  export let data;
  $: cycle_id =
    Number($page.url.searchParams.get("cycle_id")) ||
    data.class_person.class.season.cycles[0].id;
  $: ratings_query = data.supabase
    .from("ratings")
    .select("*")
    .match({ cycle_id, class_person_id: data.class_person.id });
  $: cycle = data.class_person.class.season.cycles.find(
    (cycle) => cycle.id === cycle_id,
  );
</script>

<Form
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  data-sveltekit-replacestate
  let:button
>
  <section class="flex gap1">
    {#each data.class_person.class.season.cycles as cycle}
      <label class="button" data-style="tonal">
        <input
          type="radio"
          name="cycle_id"
          value={cycle.id}
          checked={cycle_id === cycle.id}
          data-display="none"
          on:change={() => button.click()}
        />
        {cycle.name}
      </label>
    {/each}
  </section>
</Form>

<button on:click={() => window.print()}>
  <Icon icon="ph:printer" />
  Imprimir
</button>

<section class="grid gap2" id="print">
  <h3 class="tcenter">"BOLETA DE NOTAS DEL EDUCANDO"</h3>
  <section class="flex items content" style="--c: space-around">
    <picture style="width: 6rem;">
      <img src="/images/sfa.jpg" alt="" />
    </picture>
    <section class="flex direction gap3">
      <div class="grid gap1" style="grid-template-columns: 1fr 2fr;">
        <b>NOMBRE</b>
        <span>{data.class_person.person?.full_name}</span>
        <b>NIVEL</b>
        <span>{data.class_person.class.level?.name}</span>
        <b>GRADO</b>
        <span>{data.class_person.class.area.name}</span>
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
  <div class="flex direction" style="gap: 0.25rem">
    {#await ratings_query then { data: ratings }}
      {#if ratings}
        {@const grouped_courses = groupBy(
          data.class_person.class.courses,
          (course) => {
            //@ts-ignore
            if (course.course) return String(course.course.name);
            return String(course.name);
          },
        )}
        {#each Object.entries(grouped_courses).sort( ([a], [b]) => a.localeCompare(b), ) as [course, courses]}
          {@const competences = (
            courses.sort((a, b) => Number(a.order) - Number(b.order)) || []
          )
            .map((course) => (course || { competences: [] }).competences)
            .flat()}
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
                {#each courses as course, index}
                  {@const notes = ratings.filter(
                    (n) => n.course_id === course.id,
                  )}
                  {@const average = Math.round(
                    notes.reduce((a, b) => a + b.value, 0) / notes.length,
                  )}
                  <tr>
                    <td>
                      {course.name}
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
                  <td style="font-weight: 700;"> Literal </td>
                  {#each unique_competences as competence}
                    {@const notes = ratings.filter(
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
      {/if}
    {/await}
  </div>
</section>
