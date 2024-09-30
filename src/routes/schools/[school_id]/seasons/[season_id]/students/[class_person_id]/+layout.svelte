<script lang="ts">
  import { page } from "$app/stores";
  import { Menu } from "$lib/components";

  export let data;
  const options = [
    { name: "Inicio", href: "", match: true },
    { name: "Pagos", href: "orders" },
    { name: "Vender", href: "cart" },
  ];
</script>

<section class="flex direction gap2">
  <hgroup class="grid">
    <h2>{data.class_person.person?.full_name}</h2>
    <small
      >{data.class_person.class.level?.name}
      {data.class_person.class.grade}
      {data.class_person.class.section?.name}</small
    >
  </hgroup>
  <Menu
    {options}
    root="/schools/{data.school_user.school_id}/seasons/{$page.params
      .season_id}/students/{$page.params.class_person_id}"
  ></Menu>
</section>

<slot />
