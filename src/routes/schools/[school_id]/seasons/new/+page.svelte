<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import { Form, Field, Icon } from "$lib/components";
  import { message } from "$lib/stores/message.js";
  import type { TablesInsert } from "$lib/types/supabase";
  export let data;
  let season: TablesInsert<"seasons"> = {
    name: "",
    school_id: data.school_user.school_id,
    user_id: data.session.user.id,
  };
</script>

<Form
  let:loading
  onSubmit={async () => {
    const { data: newSeason, error: err } = await data.supabase.from("seasons").insert(season).select("id").single();
    if (err) return message.set(err);
    await goto(newSeason.id.toString());
  }}
>
  <Field>
    <label for="season[name]">Nombre de la temporada</label>
    <input required type="text" name="season[name]" id="season[name]" bind:value={season.name} />
  </Field>
  <button>
    <Icon icon="ph:file-plus" {loading} />
    Agregar
  </button>
</Form>
