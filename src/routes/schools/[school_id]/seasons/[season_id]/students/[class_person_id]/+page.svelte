<script lang="ts">
  import { Icon } from "$lib/components";

  export let data;
</script>

<div class="grid auto-fit gap3">
  <picture>
    <img src={data.class_person.person?.photo} alt="" />
  </picture>

  <section class="flex direction gap2">
    <div class="grid gap1" style="grid-template-columns: 1fr 1fr;">
      <b>DNI</b>
      <p>
        {data.class_person.person?.dni}
      </p>
      <b>Direccion</b>
      <p>
        {data.class_person.person?.address ?? ""}
      </p>
      <b>Telefono</b>
      <p>
        {data.class_person.person?.cellphone ?? ""}
      </p>
      <b>Codigo del estudiante</b>
      <p>
        {data.class_person.person?.school_code ?? ""}
      </p>
    </div>
    <div class="flex gap1">
      <button data-size="small"> <Icon icon="ph:pen" /> Editar </button>
      <button data-size="small" data-style="tonal">
        <Icon icon="ph:trash" />Eliminar</button
      >
    </div>
  </section>
</div>
