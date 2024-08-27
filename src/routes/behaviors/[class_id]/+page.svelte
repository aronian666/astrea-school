<script lang="ts">
  import { Table } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { setNote, opInputExcel, onPasteExcel, onKeyDownExcel } from "$lib/utils";

  export let data;
  let cycle_selected = data.clas.season?.cycles[1]!;
</script>

<section class="flex direction gap1">
  <hgroup class="grid">
    <h2>
      {data.clas.level?.name}
      {data.clas.grade}
      {data.clas.section?.name}
    </h2>
  </hgroup>
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
    let:index={y}
  >
    {@const behavior = item.behaviors.find(({ cycle_id }) => cycle_id === cycle_selected.id)}
    <tr class="input">
      <td>
        <small>
          <b>
            {y + 1}
          </b>
          {item.person?.full_name}
        </small>
      </td>
      <td style="color: {Number(behavior?.value) < 11 ? 'var(--red)' : 'var(--blue)'}">
        <input
          type="number"
          value={behavior?.value ?? ""}
          min="0"
          max="20"
          id="input0-{y}"
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
                  value,
                })
                .select()
                .single();
              error = err;
              new_behavior = nb;
            }
            if (error) return message.set(error);
            let index = item.behaviors.findIndex(({ cycle_id }) => cycle_id === cycle_selected.id);
            //@ts-ignore
            if (index !== -1) item.behaviors[index] = new_behavior;
            //@ts-ignore
            else item.behaviors.push(new_behavior);
            data = data;
          }}
          on:input={opInputExcel}
          on:paste={(e) => onPasteExcel(e, { x: 0, y })}
          on:keydown={(e) => onKeyDownExcel(e, { x: 0, y })}
        />
        <span class="tcenter w600" style="position: absolute; z-index: 1; top: 50%; translate: 0 -50%; right: 0.5rem">
          {setNote(behavior?.value)}
        </span>
      </td>
    </tr>
  </Table>
</section>
