<script lang="ts">
  import { message } from "$lib/stores/message";
  import { onKeyDownExcel, onPasteExcel, opInputExcel, setNote } from "$lib/utils";

  export let data;
  let cycle_selected = data.clas.season?.cycles[1]!;
</script>

<section class="flex direction gap1">
  <form>
    <div class="grid gap1 auto-fit" style="--width: 10rem">
      {#each data.clas.season?.cycles || [] as cycle}
        <label>
          <input type="radio" data-display="hidden" value={cycle} bind:group={cycle_selected} />
          {cycle.name}
        </label>
      {/each}
    </div>
  </form>
  <table class="bordered">
    <thead>
      <tr>
        <th> Estudiante </th>
        <th>Nota</th>
      </tr>
    </thead>
    <tbody>
      {#each data.clas.class_persons as class_person, y (`${cycle_selected.id}-${class_person.id}`)}
        {@const behavior = data.behaviors.find(
          ({ cycle_id, class_person_id }) => cycle_id === cycle_selected.id && class_person_id === class_person.id,
        )}
        <tr class="input">
          <td>
            <small>
              <b>
                {y + 1}
              </b>
              {class_person.person?.full_name}
            </small>
          </td>
          <td style="color: {Number(behavior?.value) < 11 ? 'var(--red)' : 'var(--blue)'}">
            <input
              type="number"
              value={behavior?.value ?? ""}
              min="0"
              max="20"
              id="input0-{y}"
              on:paste={(e) => onPasteExcel(e, { x: 0, y })}
              on:keydown={(e) => onKeyDownExcel(e, { x: 0, y })}
              on:change={async (e) => {
                const input = e.currentTarget;
                const value = Number(input.value);
                let error, new_behavior;
                if (behavior) {
                  const { error: err, data: nb } = await data.supabase
                    .from("behaviors")
                    .update({
                      class_person_id: class_person.id,
                      cycle_id: cycle_selected.id,
                      class_season_course_id: data.class_season_course.id,
                      value,
                    })
                    .eq("id", behavior.id)
                    .select()
                    .single();
                  error = err;
                  new_behavior = nb;
                } else {
                  const { error: err, data: nb } = await data.supabase
                    .from("behaviors")
                    .insert({
                      class_person_id: class_person.id,
                      cycle_id: cycle_selected.id,
                      class_season_course_id: data.class_season_course.id,
                      value,
                    })
                    .select()
                    .single();
                  error = err;
                  new_behavior = nb;
                }
                if (error) return message.set(error);
                let index = data.behaviors.findIndex(
                  ({ cycle_id, class_person_id }) =>
                    cycle_id === cycle_selected.id && class_person.id === class_person_id,
                );
                //@ts-ignore
                if (index !== -1) data.behaviors[index] = new_behavior;
                //@ts-ignore
                else data.behaviors.push(new_behavior);
                data = data;
              }}
              on:input={opInputExcel}
            />
            <span
              class="tcenter w600"
              style="position: absolute; z-index: 1; top: 50%; translate: 0 -50%; right: 0.5rem"
            >
              {setNote(behavior?.value)}
            </span>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</section>
