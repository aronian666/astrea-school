<script lang="ts">
  import { Button, Form, Icon, Modal, Person, Table } from "$lib/components";
  import { page } from "$app/stores";
  import { groupBy } from "$lib/utils/groupBy";
  import type { TablesInsert } from "$lib/types/supabase.js";
  import { message } from "$lib/stores/message";
  import { formToJson } from "$lib/utils";
  export let data;
  $: levels = groupBy(data.classes, (clas) => String(clas.level?.name));
  let person: TablesInsert<"persons"> = {
    dni: "",
    first_name: "",
    last_name1: "",
    last_name2: "",
  };
  let clase = data.classes[0];
  let levelSelected = data.levels[0];
</script>

<section>
  <Button data-style="gradient" onclick="add_class.showModal()"
    >Agregar clase</Button
  >
</section>
<div class="grid auto-fit gap3" style="--width: 20rem">
  {#each Object.entries(levels) as [level, classesByLevel]}
    {@const classesByGrade = groupBy(classesByLevel, (clas) => clas.area?.name)}
    <section class="flex direction gap2 panel">
      <h3>{level}</h3>
      <Table
        array={Object.entries(classesByGrade)}
        header={[{ name: "Grado" }, { name: "Secciones" }]}
        let:item
      >
        <tr>
          <td class="tcenter">{item[0]}</td>

          <td>
            <div class="flex content wrap gap1">
              {#each item[1] || [] as clas}
                <a
                  data-size="small"
                  data-shape="square"
                  data-style="tonal"
                  class="button"
                  href="classes/{clas.id}"
                >
                  {clas.section?.name}
                </a>
              {/each}
            </div>
          </td>
        </tr>
      </Table>
    </section>
  {/each}
</div>
