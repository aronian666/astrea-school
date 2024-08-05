<script lang="ts">
  import { Aside, Button, Details, Icon, Popover } from "$lib/components";
  import { page } from "$app/stores";
  export let data;
  let options: AsideOption[] = [
    {
      paths: [
        {
          icon: "iconamoon:home",
          href: "",
          name: "Inicio",
          match: true,
        },
      ],
    },
    {
      title: "Niveles",
      paths: Object.entries(data.levels).map(([level, class_season_courses]) => ({
        href: `levels/${level}`,
        name: `${class_season_courses?.length} ${level}`,
      })),
    },
  ];
</script>

<Aside {options} root="/seasons/{$page.params.season_id}" />
<slot></slot>
