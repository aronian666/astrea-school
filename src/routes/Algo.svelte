<script>
  import Letters from "./Letters.svelte";
</script>

<header>
  <nav class="flex content items" style="--c: space-between">
    <picture style="width: 2.5rem">
      <img src="/images/logo.svg" alt="" />
    </picture>
    <div class="flex gap0">
      <a class="button" href="/auth">Iniciar sesión </a>
      <a class="button" data-style="tonal" style="--color: var(--primary)" href="/auth?signUp=true">Registrarse</a>
    </div>
  </nav>
</header>

<main class="grid">
  <section class="grid content">
    <div class="flex direction" style="gap: 5rem">
      <div class="flex direction gap3">
        <hgroup>
          <span> Bienvenido al</span>
          <h1>Colegio Parroquial</h1>
        </hgroup>
        <Letters />
      </div>
      <div class="flex direction gap5">
        <article class="grid auto-fit gap5">
          <a href="/plan" class="panel gradient hover padding4 grid gap3" style="grid-template-columns: 100px 1fr;">
            <picture class="flex content items">
              <img src="/images/paper.svg" alt="Papeles" />
            </picture>
            <div>
              <h2>Curricula</h2>
              <p>Potenciamos tu éxito con una currícula innovadora y transformadora.</p>
            </div>
          </a>
          <a
            href="/workshops"
            class="panel gradient hover grid gap4 padding4"
            style="grid-template-columns: 100px 1fr;"
          >
            <picture class="flex content items">
              <img src="/images/music.svg" alt="Musica" />
            </picture>
            <div>
              <h2>Talleres</h2>
              <p>Descubre nuevas habilidades en nuestros talleres: aprendizaje práctico y enriquecedor.</p>
            </div>
          </a>
        </article>
      </div>
    </div>
  </section>
</main>

<style>
  header > nav {
    grid-column: 2 / span 1;
  }
  main {
    grid-column: 1/-1;
    grid-row: 1/-1;
    padding: 0;
    grid-template-columns: subgrid;
  }

  section:first-child {
    grid-column: 1/ -1;
    grid-template-columns: subgrid;
    min-height: 100dvh;
    background-image: url("/images/background1.webp");
    background-repeat: no-repeat;
    background-position: 100%;
  }
  section:first-child > div {
    grid-column: 2 / span 1;
  }
  section:first-child hgroup > h1 {
    font-size: clamp(4rem, 5vw, 6rem);
    line-height: clamp(4rem, 5vw, 6rem);
  }
  section:first-child hgroup > span {
    text-transform: uppercase;
    letter-spacing: 0.4rem;
    font-weight: 700;
  }
  @media (width < 1024px) {
    section:first-child > div {
      grid-column: 1 / -1;
      padding: var(--size2);
    }
  }
</style>
