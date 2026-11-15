---
title: "Purrturbed but Stable: Human-Cat Invariant Representations Across CNNs, ViTs and Self-Supervised ViTs"
date: "2025-11-04"
summary: "CVPR 2026. Shah and Tripathi compare frozen vision encoders on paired human frames and cat-vision-filtered frames."
tags: [vision, alignment]
---

Domestic cats have a vertical slit pupil. The work Shah and Tripathi cite ties that shape to ambush predation. The rest of the eye differs from a human eye as well: a rod-heavy retina, coarser acuity, a wider field. The paper asks where that optical gap shows up in the features of current vision models. The comparison stays inside the encoders. One frozen network sees a frame from a human camera and a second version of the same frame after a cat-vision filter. The score is how similarly those two feature sets are arranged.

The frames come from 191 point-of-view videos of domestic cats, a camera on the neck, taken from public recordings and cut into stills. The untouched frame is the human view. A biologically informed filter builds the paired feline view. The set is 191 videos and over 300,000 frame pairs, joined on the filename so that each human frame has at most one filtered partner. Pairs with a missing file, a corrupt file, or a non-RGB image are dropped. The encoders stay frozen, so the score is a property of the pretrained features.

The filter is a stack of engineering approximations, run with defaults the authors publish. The pupil is a vertical slit at a 3 to 1 aspect ratio. Rods are weighted against cones at about 25 to 1. Spatial acuity is cut to about one sixth of human high-contrast acuity. Spectral curves peak near 450 nm, near 556 nm, and near 498 to 501 nm, for the short-wavelength cone, the long-wavelength cone, and the rods. The same section adds a wider field of view, a temporal response, and a low-light gain meant to approximate the tapetum. The filter is applied before feature extraction, so the optics and the scene are both in the input.

The model list covers the usual families. Convolutional networks: ResNet, DenseNet, EfficientNet, ConvNeXt, and MobileNet. Supervised transformers: ViT-B/16, ViT-L/16, and windowed Swin models. Self-supervised transformers: DINO, DINOv2, and DINOv3. Each image is resized and normalized with that model's own evaluation recipe. Convolutional maps become vectors by global average pooling. Transformer layers contribute token features. At matched depths the authors compute Centered Kernel Alignment, both linear and RBF, and Representational Similarity Analysis with a Mantel permutation test. CKA asks whether the two clouds of activations share a geometry. RSA compares the grid of pairwise dissimilarities. A high score means the human frame and the filtered frame land in similarly arranged features.

<figure class="schematic">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 360" aria-hidden="true">
  <rect class="box" x="12" y="12" width="160" height="80"/>
  <text class="label" x="92" y="46" font-size="13">Human frame</text>
  <text class="sub" x="92" y="68" font-size="11">original</text>
  <rect class="box" x="188" y="12" width="160" height="80"/>
  <text class="label" x="268" y="46" font-size="13">Filtered frame</text>
  <text class="sub" x="268" y="68" font-size="11">cat-vision filter</text>
  <path class="flow" d="M92 92 V116"/>
  <path class="flow" d="M268 92 V116"/>
  <path class="flow" d="M92 116 H268"/>
  <path class="flow" d="M180 116 V136"/>
  <path class="flow" d="M174 130 L180 140 L186 130"/>
  <rect class="box" x="16" y="144" width="328" height="76"/>
  <text class="label" x="180" y="176" font-size="16">Frozen encoder</text>
  <text class="sub" x="180" y="198" font-size="12">weights fixed</text>
  <path class="flow" d="M180 220 V240"/>
  <path class="flow" d="M174 234 L180 244 L186 234"/>
  <rect class="box" x="16" y="252" width="328" height="84"/>
  <text class="label" x="180" y="286" font-size="16">CKA</text>
  <text class="sub" x="180" y="310" font-size="12">linear and RBF</text>
</svg>
<figcaption>Schematic. A human frame and a cat-vision-filtered frame pass through a frozen encoder, then CKA.</figcaption>
</figure>

DINO ViT-B/16 leads the summary table. Mean RBF-CKA is 0.8144, mean linear CKA is 0.7446, and mean RSA is 0.6980. The best block by CKA is block0, early in the stack. Supervised ViT-L/16 is close on mean RBF-CKA, at 0.8057, and lower on mean RSA, at 0.4647, with its best CKA block at block14. EfficientNet-B3 is the strongest convolutional network in the table, mean RBF-CKA 0.7017, best layer stage5. Swin-B, attention limited to windows, sits at mean RBF-CKA 0.4688. On these means DINO ViT-B/16 is ahead of ViT-L/16, EfficientNet-B3 is the top convolutional network and still under the plain ViTs, and Swin-B is under the plain ViTs. DINO peaks early. The supervised ViTs and the convolutional nets peak deeper. DINOv2 and DINOv3 reach high scores in early layers and still post lower means than DINO ViT-B/16.

CKA can be high while a shift test still rejects. Maximum mean discrepancy, energy distance, and a projected 1-Wasserstein distance look at the raw distributions. CKA and RSA can ignore a rescaling that those distances still count. The discussion reports that the shift tests often reject after Benjamini-Hochberg control at 0.05, including for models with strong geometric scores. Shared shape and a shift in mass can both be present.

The scene is fixed, the optics change, and the weights stay put, so a high score is a fact about pretraining. DINO's early block is the paper's evidence that token-level self-supervision lines the two image statistics up before the later blocks. A supervised ViT can come close on CKA and remain weaker on RSA, which the authors read as a split between kernel similarity and representational geometry. They treat the pattern as a hypothesis about where cross-species visual features converge. A comparison of these matrices with recordings from animal cortex is future work. This paper measures the encoder, under this filter, on this paired set.

The filter section states the limit in plain terms. The transformation is an engineering approximation of feline optics. It leaves out wavelength-dependent blur, a detailed retinal sampling mosaic, chromatic aberration, and a pupil that changes with the light. The authors describe it as a biologically motivated stress test for invariance. The alignment figures belong to that approximation.

This paper is CVPR 2026. The text is at https://arxiv.org/abs/2511.02404, and the code and dataset are at https://github.com/aryashah2k/Purrturbed-but-Stable.
