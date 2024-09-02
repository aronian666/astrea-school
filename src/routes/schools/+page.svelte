<script lang="ts">
  import { goto } from "$app/navigation";
  import { Field, Form, Icon, Modal, Button, Header } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { ExtendedDate } from "$lib/utils/extendedDate.js";
  import { formToJson } from "$lib/utils/filter";
  export let data;
</script>

<section class="flex gap0">
  <Button data-style="gradient" onclick="add_season.showModal()">Nueva temporada</Button>
  <Button data-style="tonal" style="--color: var(--primary)" onclick="add_school.showModal()">Nueva institucion</Button>
</section>
<section class="flex direction gap3">
  {#each data.school_users as { school, role }}
    <section class="grid gap2">
      <h3>{school.name}</h3>
      <div class="grid auto-fill gap1" style="grid-auto-rows: 8rem">
        {#each school.seasons as season}
          <a class="panel" href="/schools/{school.id}/seasons/{season.id}">
            <h4>
              {season.name}
            </h4>
            <small class="gray70">
              {new ExtendedDate(season.start).toIntl({ day: "2-digit", year: "numeric", month: "2-digit" })}
              - {new ExtendedDate(season.finish).toIntl({ day: "2-digit", year: "numeric", month: "2-digit" })}
            </small>
          </a>
        {/each}
      </div>
    </section>
  {/each}
</section>

<Modal id="add_school">
  <Form
    let:loading
    onSubmit={async (e) => {
      // @ts-ignore
      const { school } = formToJson(new FormData(e.currentTarget));
      const { data: newSchool, error } = await data.supabase.from("schools").insert(school).select("id").single();
      if (error) return message.set(error);
      const { error: err } = await data.supabase
        .from("school_users")
        .insert({ school_id: newSchool.id, user_id: data.session.user.id, role_id: 2 });
      if (err) return message.set(err);
      return goto(`/schools/${newSchool.id}`);
    }}
  >
    <h2 class="tcenter">Agregar institucion</h2>
    <Field>
      <label for="school[name]">
        <Icon icon="ph:building" />
        Nombre de la institucion
      </label>
      <input
        id="school[name]"
        name="school[name]"
        type="text"
        placeholder="Institucion educativa..."
        required
        minlength="5"
      />
    </Field>

    <button data-style="gradient">
      <Icon icon="ph:sing-plus" {loading} />
      Agregar
    </button>
  </Form>
</Modal>

<Modal id="add_season">
  <Form
    let:loading
    onSubmit={async (e) => {
      const { season, start, end } = formToJson(new FormData(e.currentTarget));
      Object.assign(season, {
        user_id: data.session.user.id,
        period: `[${start}, ${end})`,
      });
      const { data: newSeason, error: err } = await data.supabase.from("seasons").insert(season).select("id").single();
      if (err) return message.set(err);
      await goto(`/schools/${season.school_id}/seasons/${newSeason.id}`);
    }}
  >
    <h2>Agregar temporada</h2>
    <Field>
      <label for="season[school_id]"> Institucion </label>
      <select name="season[school_id]" id="season[school_id]">
        {#each data.school_users as { school }}
          <option value={school.id}>{school.name}</option>
        {/each}
      </select>
    </Field>
    <Field>
      <label for="season[name]"> Nombre de la temporada </label>
      <input type="text" name="season[name]" id="season[name]" />
    </Field>
    <div class="grid gap3 auto-fit">
      <Field>
        <label for="start"> Inicio </label>
        <input type="date" required name="start" id="start" />
      </Field>
      <Field>
        <label for="end"> Fin </label>
        <input type="date" required name="end" id="end" />
      </Field>
    </div>
    <button>
      <Icon icon="ph:plus" {loading} active="bold" />
      Crear temporada
    </button>
  </Form>
</Modal>
