---
layout: default
---

### Blogposts

<style>
  .blog-list { list-style: none; padding: 0; margin: 24px 0 0; }
  .blog-list li {
    display: flex; align-items: center; gap: 20px;
    padding: 16px 0; border-bottom: 1px solid #e6e1d4;
  }
  .blog-list li:last-child { border-bottom: none; }
  .blog-list .thumb { flex: 0 0 140px; }
  .blog-list .thumb a { display: block; }
  .blog-list .thumb img {
    width: 140px; height: 90px; object-fit: cover;
    border: 1px solid #d8d3c4; border-radius: 4px;
    background: #fbf7f0;
  }
  .blog-list .title { line-height: 1.4; }
  .blog-list .title a {
    font-weight: 500; text-decoration: none; font-size: 1.05em;
  }
  .blog-list .title a:hover { text-decoration: underline; }
  .blog-list .meta {
    display: block; margin-top: 4px;
    font-size: 0.86em; color: #6c6960;
  }
  @media (max-width: 540px) {
    .blog-list li { flex-direction: column; align-items: flex-start; }
    .blog-list .thumb img { width: 100%; height: auto; max-width: 360px; }
  }
</style>

<ul class="blog-list">

  <li>
    <span class="thumb">
      <a href="./stochastic_self_stabilization.html">
        <img src="./assets/img/seos_fig1_trajectories.png" alt="Sharpness trajectories under SGD">
      </a>
    </span>
    <span class="title">
      <a href="./stochastic_self_stabilization.html">Why Stochastic Gradient Descent Stops Just Short of the Edge</a>
      <span class="meta">A closed-form sharpness gap explains a long-observed property of mini-batch training.</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./accelerated_nesterov_deepReLU.html">
        <img src="./assets/img/agd_exp1.png" alt="Nesterov acceleration experiment">
      </a>
    </span>
    <span class="title">
      <a href="./accelerated_nesterov_deepReLU.html">Provable Acceleration of Nesterov's Momentum for Deep ReLU Networks</a>
      <span class="meta">A new objective class that makes Nesterov provably accelerated for non-trivial neural architectures.</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./parallel_deflation.html">
        <img src="./assets/img/ParallelDeflationDiagram.png" alt="Parallel Deflation diagram">
      </a>
    </span>
    <span class="title">
      <a href="./parallel_deflation.html">Provable Model-Parallel Distributed Principal Component Analysis with Parallel Deflation</a>
      <span class="meta">A self-correcting parallel deflation scheme for distributed PCA, with convergence guarantees.</span>
    </span>
  </li>

</ul>
