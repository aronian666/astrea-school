<script>
  import { page } from "$app/stores";
  import { Form, Icon } from "$lib/components";
  import { message } from "$lib/stores/message";
  import {
    onKeyDownExcel,
    onPasteExcel,
    opInputExcel,
    setNote,
  } from "$lib/utils";

  export let data;
  $: course_id = Number(
    $page.url.searchParams.get("course_id") ||
      data.clas.class_courses[0].course.id,
  );
  $: cycle_id = Number(
    $page.url.searchParams.get("cycle_id") || data.clas.season.cycles[0].id,
  );
  $: query_ratings = data.supabase
    .from("ratings")
    .select()
    .match({ course_id, cycle_id })
    .in(
      "class_person_id",
      data.clas.class_persons.map((c) => c.id),
    );
  $: course = data.clas.class_courses.find(
    (class_course) => class_course.course.id === Number(course_id),
  )?.course;
</script>

<hgroup class="grid">
  <h1>{data.clas.level.name} {data.clas.area.name} {data.clas.section.name}</h1>
  <small>{data.clas.season.school?.name}</small>
</hgroup>

<Form
  class="grid gap2"
  data-sveltekit-keepfocus
  data-sveltekit-noscroll
  data-sveltekit-replacestate
  let:button
>
  <section style="overflow-x: auto">
    <div class="flex gap1" style="width: max-content;">
      {#each data.clas.class_courses as { course }}
        <label
          class="button"
          data-style="tonal"
          data-size="medium"
          on:change={(e) => button.click()}
        >
          <input
            type="radio"
            name="course_id"
            data-display="none"
            checked={course_id === course.id}
            value={course.id}
          />
          {course.name}
        </label>
      {/each}
    </div>
  </section>
  <section class="flex gap1">
    {#each data.clas.season.cycles as cycle}
      <label
        class="button"
        data-style="tonal"
        on:change={(e) => button.click()}
      >
        <input
          type="radio"
          name="cycle_id"
          data-display="none"
          value={cycle.id}
          checked={cycle_id === cycle.id}
        />
        {cycle.name}
      </label>
    {/each}
  </section>
</Form>

<section class="grid">
  {#await query_ratings}
    Cargando...
  {:then { data: ratings, error }}
    {#if ratings}
      <table class="bordered">
        <thead>
          <tr>
            <th></th>
            <th>Estudiante</th>
            {#each course?.competences || [] as competence, index}
              <th>
                <div class="flex items content">
                  <button
                    popovertarget="competence{index}"
                    style="anchor-name: --competence{index}"
                    data-style="text"
                    data-shape="square"
                    data-size="small"
                  >
                    <Icon icon="ph:warning-circle" width="1.5rem" />
                  </button>
                </div>
                <div
                  popover="auto"
                  class="panel"
                  id="competence{index}"
                  style="position-anchor: --competence{index}; inset-area: bottom span-left;"
                >
                  {competence.name}
                </div>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each data.clas.class_persons as class_person, y}
            <tr class="input">
              <td>{y + 1}</td>
              <td>
                <small class="grid">
                  <span style="color: var(--black)">
                    {class_person.person.last_name1}
                    {class_person.person.last_name2}
                  </span>
                  <span>
                    {class_person.person.first_name}
                  </span>
                </small>
              </td>
              {#each course?.competences || [] as competence, x (`${competence.id}-${class_person.id}-${cycle_id}`)}
                {@const competence_note = ratings.find(
                  (note) =>
                    note.competence_id === competence.id &&
                    class_person.id === note.class_person_id,
                )}
                <td
                  style="color: {Number(competence_note?.value) < 11
                    ? 'var(--red)'
                    : 'var(--blue)'}"
                >
                  <input
                    type="number"
                    value={competence_note?.value ?? ""}
                    min="0"
                    max="20"
                    id="input{x}-{y}"
                    on:keydown={(e) => onKeyDownExcel(e, { x, y })}
                    on:paste={(e) => onPasteExcel(e, { x, y })}
                    on:change={async (e) => {
                      const input = e.currentTarget;
                      const value = Number(input.value);
                      const { error, data: new_note } = await data.supabase
                        .from("ratings")
                        .upsert({
                          class_person_id: class_person.id,
                          course_id: Number(course_id),
                          competence_id: competence.id,
                          cycle_id: Number(cycle_id),
                          value,
                        })
                        .select()
                        .single();
                      if (error) return message.set(error);
                      let note = ratings.find(
                        (note) =>
                          note.competence_id === competence.id &&
                          class_person.id === note.class_person_id,
                      );
                      if (note) return Object.assign(note, new_note);
                      ratings.push(new_note);
                    }}
                    on:input={opInputExcel}
                  />
                  <span
                    class="tcenter w700"
                    style="position: absolute; z-index: 1; top: 50%; translate: 0 -50%; right: 0.5rem"
                  >
                    {setNote(competence_note?.value)}
                  </span>
                </td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    {/if}
  {/await}
</section>
