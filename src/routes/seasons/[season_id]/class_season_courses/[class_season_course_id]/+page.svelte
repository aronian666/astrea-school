<script lang="ts">
  import { Field, Icon, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { debounce } from "$lib/utils/debounce.js";
  import { setNote } from "$lib/utils/models.js";

  export let data;
  let cycle_id = data.class_season_course.class?.season?.cycles[1].id;
  $: notes = data.class_season_course.notes.filter((note) => cycle_id === note.cycle_id);
</script>

<hgroup>
  <h1>{data.class_season_course.season_course?.course?.name}</h1>
  <small>
    {data.class_season_course.class?.level?.name}
    {data.class_season_course.class?.grade}
    {data.class_season_course.class?.section?.name}
  </small>
</hgroup>
<form>
  <div class="grid auto-fit gap1" style="--width: 5rem">
    {#each data.class_season_course.class?.season?.cycles || [] as cycle}
      <label>
        <input data-display="hidden" type="radio" value={cycle.id} bind:group={cycle_id} />
        {cycle.name}
      </label>
    {/each}
  </div>
</form>
<section class="grid">
  <table class="bordered">
    <thead>
      <tr>
        <th>Estudiante</th>
        {#each data.class_season_course.season_course?.competences || [] as competence, index}
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
      {#each data.class_season_course.class?.class_persons || [] as class_person, index}
        <tr>
          <td>
            <span class="w500">
              {index + 1}
            </span>
            {class_person.person?.full_name}
          </td>
          {#each data.class_season_course.season_course?.competences || [] as competence}
            {@const competence_note = notes.find(
              (note) => note.competence_id === competence.id && class_person.id === note.class_person_id,
            )}
            <td>
              <div
                class="flex items content"
                style="color: {Number(competence_note?.value) < 11 ? 'var(--red)' : 'var(--primary)'}"
              >
                <input
                  type="number"
                  value={competence_note?.value ?? ""}
                  min="0"
                  max="20"
                  on:change={async (e) => {
                    const input = e.currentTarget;
                    const value = Number(input.value);
                    const { error, data: new_note } = await data.supabase
                      .from("notes")
                      .upsert({
                        class_person_id: class_person.id,
                        class_season_course_id: data.class_season_course.id,
                        competence_id: competence.id,
                        cycle_id: Number(cycle_id),
                        value,
                      })
                      .select()
                      .single();
                    if (error) return message.set(error);
                    let note = notes.find(
                      (note) => note.competence_id === competence.id && class_person.id === note.class_person_id,
                    );
                    if (note) return Object.assign(note, new_note);
                    data.class_season_course.notes.push(new_note);
                    data = data;
                  }}
                  on:input={(e) => {
                    const input = e.currentTarget;
                    const value = Number(input.value);
                    if (value < 0 || value > 20) return (input.value = "0");
                    const td = input.parentNode;
                    const span = input.nextElementSibling;

                    //@ts-ignore
                    span.innerHTML = setNote(value);
                    if (value < 11) {
                      //@ts-ignore
                      td.style.color = "var(--red)";
                    } else {
                      //@ts-ignore
                      td.style.color = "var(--primary)";
                    }
                  }}
                />
                <span class="tcenter w600">
                  {setNote(competence_note?.value)}
                </span>
              </div>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</section>

<style>
  td {
    font-size: var(--small);
  }
</style>
