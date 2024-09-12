<svelte:head>
  <title>Lugens</title>
  <meta
    name="description"
    content="Gestione su inventario y facturación de manera eficiente. Nuestra plataforma le permite controlar el stock de productos, generar facturas al instante y llevar un seguimiento detallado de sus ventas. Simplifique la administración de su almacén con nuestra herramienta integral."
  />
</svelte:head>

<main style="padding: 0">
  <section
    class="flex auto-fit wrap content items"
    style="height: 100dvh; --min: 30rem; --gap: var(--size1000); padding: var(--size100)"
  >
    <picture class="self">
      <img src="/images/children.svg" alt="NInios saltando" />
    </picture>

    <div class="self flex items content direction gap7">
      <h1 style="font-size: var(--size500);" class="tcenter">
        La forma sencilla y rápida de gestionar tu entidad educativa.
      </h1>
      <div class="flex gap2 direction" style="width: 20rem;">
        <a
          class="button"
          data-size="large"
          data-style="gradient"
          href="/auth?signUp=true"
        >
          Empezar
        </a>
        <a class="button" data-size="large" data-style="outline" href="/auth">
          Ya tengo una cuenta
        </a>
      </div>
    </div>
  </section>
</main>
