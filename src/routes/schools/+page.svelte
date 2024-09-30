<script lang="ts">
  import { goto } from "$app/navigation";
  import { Form, Icon, Modal, Button, Header } from "$lib/components";
  import { message } from "$lib/stores/message";
  import { ExtendedDate } from "$lib/utils/extendedDate.js";
  import { formToJson } from "$lib/utils/filter";
  export let data;
</script>

<section class="flex gap1">
  <Button data-style="gradient" onclick="add_season.showModal()">
    Nueva temporada
  </Button>
  <Button
    data-style="tonal"
    style="--color: var(--primary)"
    onclick="add_school.showModal()"
  >
    Nueva institucion
  </Button>
</section>
<section class="flex direction gap3">
  {#each data.user.school_users as { school, role }}
    <section class="grid gap2">
      <h3>{school.name}</h3>
      <div class="grid auto-fill gap1" style="grid-auto-rows: 8rem">
        {#each school.seasons as season}
          <a class="panel" href="/schools/{school.id}/seasons/{season.id}">
            <h4>
              {season.name}
            </h4>
            <small style="font-weight: 400;">
              {season.start_at} - {season.end_at}
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
      const { school } = formToJson(new FormData(e.currentTarget));
      const { data: newSchool, error } = await data.supabase
        .from("schools")
        .insert(school)
        .select("id")
        .single();
      if (error) return message.set(error);
      const { error: err } = await data.supabase.from("school_users").insert({
        school_id: newSchool.id,
        user_id: data.session.user.id,
        role_id: 2,
      });
      if (err) return message.set(err);
      return goto(`/schools/${newSchool.id}`);
    }}
  >
    <h2 class="tcenter">Agregar institucion</h2>
    <label for="school[name]">
      <span> Nombre de la institucion </span>
      <input
        id="school[name]"
        name="school[name]"
        type="text"
        placeholder="Institucion educativa..."
        required
        minlength="5"
      />
    </label>
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
      const { data: newSeason, error: err } = await data.supabase
        .from("seasons")
        .insert(season)
        .select("id")
        .single();
      if (err) return message.set(err);
      await goto(`/schools/${season.school_id}/seasons/${newSeason.id}`);
    }}
  >
    <h2>Agregar temporada</h2>
    <section class="grid gap3">
      <label>
        <span> Institucion </span>
        <select name="season[school_id]">
          {#each data.user.school_users as { school }}
            <option value={school.id}>{school.name}</option>
          {/each}
        </select>
      </label>
      <label>
        <span> Nombre de la temporada </span>
        <input type="text" name="season[name]" />
      </label>
      <div class="grid gap3 auto-fit">
        <label>
          <span> Inicio </span>
          <input type="date" required name="start" />
        </label>
        <label>
          <span> Fin </span>
          <input type="date" required name="end" />
        </label>
      </div>
    </section>
    <button>
      <Icon icon="ph:plus" {loading} active="bold" />
      Crear temporada
    </button>
  </Form>
</Modal>
