<script lang="ts">
  import { Field, Icon, Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { debounce } from "$lib/utils/debounce.js";
  import { onKeyDownExcel, onPasteExcel, opInputExcel, setNote } from "$lib/utils/models.js";

  export let data;
  let cycle_id = data.clas.season?.cycles[1].id!;
  $: notes = data.class_season_course.notes.filter((note) => cycle_id === note.cycle_id);
</script>

<form>
  <Field>
    <div class="grid auto-fit gap1" style="--width: 10rem">
      {#each data.clas.season?.cycles || [] as cycle}
        <label>
          <input data-display="hidden" type="radio" value={cycle.id} bind:group={cycle_id} />
          {cycle.name}
        </label>
      {/each}
    </div>
  </Field>
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
      {#each data.clas?.class_persons || [] as class_person, y}
        <tr class="input">
          <td>
            <span class="w500">
              {y + 1}
            </span>
            {class_person.person?.full_name}
          </td>
          {#each data.class_season_course.season_course?.competences || [] as competence, x (`${competence.id}-${class_person.id}-${cycle_id}`)}
            {@const competence_note = notes.find(
              (note) => note.competence_id === competence.id && class_person.id === note.class_person_id,
            )}
            <td style="color: {Number(competence_note?.value) < 11 ? 'var(--red)' : 'var(--blue)'}">
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
</section>

<style>
  td {
    font-size: var(--small);
  }
  tr td:first-child {
    padding: 0 0.25rem;
  }
</style>
