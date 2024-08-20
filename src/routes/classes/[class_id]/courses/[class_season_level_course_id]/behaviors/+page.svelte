<script lang="ts">
  import { Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { setNote } from "$lib/utils/models.js";

  export let data;
  let cycle_selected = data.clas.season?.cycles[1]!;
</script>

<section class="flex direction gap1">
  <form>
    <div class="grid gap1 auto-fit">
      {#each data.clas.season?.cycles || [] as cycle}
        <label>
          <input type="radio" data-display="hidden" value={cycle} bind:group={cycle_selected} />
          {cycle.name}
        </label>
      {/each}
    </div>
  </form>
  <Table
    header={[{ name: "Estudiante" }, { name: "Comportamiento" }]}
    class="bordered"
    array={data.clas.class_persons}
    let:item
    let:index
  >
    {@const behavior = data.behaviors.find(
      ({ cycle_id, class_person_id }) => cycle_id === cycle_selected.id && class_person_id === item.id,
    )}
    <tr class="input">
      <td>
        {index + 1}
        {item.person?.full_name}
      </td>
      <td style="color: {Number(behavior?.value) < 11 ? 'var(--red)' : 'var(--primary)'}">
        <input
          type="number"
          value={behavior?.value ?? ""}
          min="0"
          max="20"
          on:change={async (e) => {
            const input = e.currentTarget;
            const value = Number(input.value);
            let error, new_behavior;
            if (behavior) {
              const { error: err, data: nb } = await data.supabase
                .from("behaviors")
                .update({
                  class_person_id: item.id,
                  cycle_id: cycle_selected.id,
                  class_season_level_course_id: data.class_season_level_course.id,
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
                  class_person_id: item.id,
                  cycle_id: cycle_selected.id,
                  class_season_level_course_id: data.class_season_level_course.id,
                  value,
                })
                .select()
                .single();
              error = err;
              new_behavior = nb;
            }
            if (error) return message.set(error);
            let index = data.behaviors.findIndex(
              ({ cycle_id, class_person_id }) => cycle_id === cycle_selected.id && item.id === class_person_id,
            );
            if (index !== -1) data.behaviors[index] = new_behavior;
            else data.behaviors.push(new_behavior);
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
        <span class="tcenter w600" style="position: absolute; z-index: 1; top: 50%; translate: 0 -50%; right: 0.5rem">
          {setNote(behavior?.value)}
        </span>
      </td>
    </tr>
  </Table>
</section>
