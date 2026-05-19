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
  .blog-list .thumb { flex: 0 0 180px; }
  .blog-list .thumb a {
    display: flex; align-items: center; justify-content: center;
    width: 180px; height: 110px;
    background: #ffffff;
    border: 1px solid #d8d3c4; border-radius: 4px;
    overflow: hidden;
  }
  .blog-list .thumb img {
    max-width: 96%; max-height: 96%;
    width: auto; height: auto;
    object-fit: contain;
    display: block;
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
  .blog-list .credits {
    display: block; margin-top: 4px;
    font-size: 0.82em; color: #8a8780; font-style: italic;
  }
  @media (max-width: 540px) {
    .blog-list li { flex-direction: column; align-items: flex-start; }
    .blog-list .thumb, .blog-list .thumb a { width: 100%; max-width: 360px; height: auto; aspect-ratio: 16 / 10; }
  }
</style>

<ul class="blog-list">

  <li>
    <span class="thumb">
      <a href="./asymmetric_input.html">
        <img src="./assets/img/air_thumbnail.svg" alt="The AIR architecture: one shared Transformer block, two latent roles — input injected in the L-update, absent in the H-update">
      </a>
    </span>
    <span class="title">
      <a href="./asymmetric_input.html">One Model, Two Roles: Emergent Specialization in a Shared Recurrent Transformer</a>
      <span class="meta">A minimal architectural asymmetry — the input enters one update but not the other — is enough to make a shared-weight recurrent Transformer behave like two. Matches the two-network HRM baseline with half the parameters on Sudoku-Extreme (60.0% vs 55.0%) and Maze-30&times;30 (75.6% vs 74.5%). <a href="https://arxiv.org/abs/2605.17811">arXiv:2605.17811</a>.</span>
      <span class="credits">With <a href="https://juchengshen.github.io/">Jucheng Shen</a> and <a href="https://www.linkedin.com/in/barbara-su-966314268/">Barbara Su</a> (Rice CS).</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./adapad.html">
        <img src="./assets/img/adapad_thumbnail.svg" alt="Five worker error envelopes converging across communication rounds — the self-correction property of AdaPaD">
      </a>
    </span>
    <span class="title">
      <a href="./adapad.html">From PCA to LoRA: Why Fine-Tuning Could Have Been Parallel All Along</a>
      <span class="meta">A 1933 deflation convention let rank-1 errors compound in LoRA fine-tuning. AdaPaD does it in parallel — and the errors correct themselves, provably. Best GLUE average (89.34) at matched 0.34M parameter budget; 3.62× per-batch speedup on 4 H200 GPUs. <a href="https://arxiv.org/abs/2605.10741">arXiv:2605.10741</a>.</span>
      <span class="credits">With <a href="https://github.com/barbara-su">Barbara Su</a>, <a href="https://jasperliao.github.io/">Fangshuo (Jasper) Liao</a> (Rice CS).</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./ghost_mamba2.html">
        <img src="./assets/img/ghost_thumbnail.png" alt="Phantom and corporeal hidden states in Mamba2-1.3B">
      </a>
    </span>
    <span class="title">
      <a href="./ghost_mamba2.html">GHOST: pruning Mamba2 by what each channel does</a>
      <span class="meta">A forward-only state pruner for Mamba2 selective SSMs — controllability × observability, two forward passes, ~15 GB peak VRAM. ICML 2026.</span>
      <span class="credits">With <a href="https://github.com/Menezmic21">Michael Menezes</a> (Rice CS).</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./multiplicative_gaussian_input.html">
        <img src="./assets/img/mgi_thumbnail.png" alt="Smoothed ReLU under multiplicative Gaussian input noise">
      </a>
    </span>
    <span class="title">
      <a href="./multiplicative_gaussian_input.html">How a little Gaussian dust changes how a network learns</a>
      <span class="meta">Multiply every input by random noise. Training still converges — to a target whose distance from the global minimum we can write down.</span>
      <span class="credits">With Afroditi Kolomvaki, <a href="https://jasperliao.github.io/">Fangshuo (Jasper) Liao</a>, Evan Dramko, Ziyun Guang (Rice CS).</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./stochastic_self_stabilization.html">
        <img src="./assets/img/seos_fig1_trajectories.png" alt="Sharpness trajectories under SGD">
      </a>
    </span>
    <span class="title">
      <a href="./stochastic_self_stabilization.html">Why Stochastic Gradient Descent Stops Just Short of the Edge</a>
      <span class="meta">A closed-form sharpness gap explains a long-observed property of mini-batch training.</span>
      <span class="credits">With <a href="https://jasperliao.github.io/">Fangshuo (Jasper) Liao</a>, Afroditi Kolomvaki (Rice CS).</span>
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
      <span class="credits">With <a href="https://jasperliao.github.io/">Fangshuo (Jasper) Liao</a> (Rice CS).</span>
    </span>
  </li>

  <li>
    <span class="thumb">
      <a href="./parallel_deflation.html">
        <img src="./assets/img/ParallelDeflationDiagram.png" alt="Parallel deflation diagram">
      </a>
    </span>
    <span class="title">
      <a href="./parallel_deflation.html">Provable Model-Parallel Distributed Principal Component Analysis with Parallel Deflation</a>
      <span class="meta">A self-correcting parallel deflation scheme for distributed PCA, with convergence guarantees.</span>
      <span class="credits">With <a href="https://jasperliao.github.io/">Fangshuo (Jasper) Liao</a>, Wenyi Su (Rice CS).</span>
    </span>
  </li>

</ul>
