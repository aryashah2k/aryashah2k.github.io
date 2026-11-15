---
title: "In Search of Goodness: Large Scale Benchmarking of Goodness Functions for the Forward-Forward Algorithm"
date: "2025-11-23"
summary: "Shah and Tripathi compare 21 goodness functions for the Forward-Forward algorithm on four image datasets."
tags: [goodness, learning]
---

Backpropagation trains a deep network by carrying an error down the layers. That return path needs the forward weights in transpose, the weight-transport problem, and it needs one error computed at the top of the network. Hinton's Forward-Forward algorithm replaces the global backward pass with a second forward pass. Each layer still minimizes a local loss. One pass uses positive data: real samples the layer should treat as good. The other uses negative data: corrupted or conflicting samples the layer should treat as bad. The lesson is a scalar, goodness, computed from the layer's own activity. The local loss pushes positive goodness above a threshold and negative goodness below it.

Hinton's account used the sum of squares of those activities. Shah and Tripathi treat the formula as an open choice. A sum of squares rewards strong activity on real samples. Other objectives ask for other structure: a margin between a positive sample and a negative one, a prediction of the layer's own activity, a sparse code, a small game among the units. If Forward-Forward is the local alternative to backpropagation, goodness is the signal the layer actually gets. They implement 21 functions in one registry and train the same network under each of them.

The network is a multilayer perceptron: 4 fully connected layers, 2000 units each, a ReLU that still lets the local loss send gradient through the negative part, and Adam. Shared settings are a learning rate of 0.001, batch size 100, and 20 epochs. The sets are MNIST, FashionMNIST, CIFAR-10, and STL-10. Images are flattened and normalized. Negative samples follow Hinton's supervised trick. The class label is written into the picture. A positive example pairs the image with the correct one-hot label. A negative example pairs the same image with an incorrect label. The pixels are shared, so the layer has to learn which label belongs with them.

With goodness written as G and the threshold as theta, the local loss is

<div class="math-display">$L=\log(1+\exp(-(G(y_{pos})-\theta)))+\log(1+\exp(G(y_{neg})-\theta)).$</div>

<figure class="schematic">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 280" aria-hidden="true">
  <rect class="box" x="12" y="16" width="160" height="84"/>
  <text class="label" x="92" y="50" font-size="14">Positive pass</text>
  <text class="sub" x="92" y="72" font-size="11">correct label</text>
  <rect class="box" x="188" y="16" width="160" height="84"/>
  <text class="label" x="268" y="50" font-size="14">Negative pass</text>
  <text class="sub" x="268" y="72" font-size="11">wrong label</text>
  <path class="flow" d="M92 100 V128"/>
  <path class="flow" d="M268 100 V128"/>
  <path class="flow" d="M92 128 H268"/>
  <path class="flow" d="M180 128 V148"/>
  <path class="flow" d="M174 142 L180 152 L186 142"/>
  <rect class="box" x="16" y="156" width="328" height="92"/>
  <text class="label" x="180" y="196" font-size="16">Goodness</text>
  <text class="sub" x="180" y="220" font-size="12">scalar G on the layer</text>
</svg>
<figcaption>Schematic. A positive forward pass and a negative forward pass meet in a goodness function.</figcaption>
</figure>

They record two accuracies, plus energy and carbon. Multi-pass accuracy is the native Forward-Forward readout: score candidate labels by accumulated goodness on a neutral input, and keep the label with the highest total. Classification accuracy is a linear classifier fit on the frozen representation, a check on linear separability. CodeCarbon logs energy for the GPU, the CPU, and RAM, and turns that energy into carbon using the local grid. The abstract reports that both accuracy and carbon move when the goodness function changes, and that some functions outperform the sum-of-squares baseline.

The abstract reports three classification accuracies from the sweep. game_theoretic_local reaches 97.15 percent on MNIST. softmax_energy_margin_local reaches 82.84 percent on FashionMNIST. triplet_margin_local reaches 37.69 percent on STL-10. Three functions, three datasets. Sum of squares remains the baseline in the same tables. Which function leads depends on the dataset and on which accuracy is in view, the linear probe or the multi-pass readout. On CIFAR-10, sparse_l1_local leads the multi-pass column and also posts the lowest carbon of those runs. The algebra inside G is doing real work on both axes.

Goodness is the teaching signal at the layer. Sum of squares raises it on real samples and lowers it on hybrids. A margin keeps positive and negative samples apart. Predictive coding asks a layer to account for its own activity. Game-theoretic goodness treats the units as players. The benchmark logs what those choices do to accuracy and to energy on four ordinary image sets. Shah and Tripathi argue that a Forward-Forward network should have its goodness chosen on purpose, with the carbon of that choice counted, because the formula changes both the score and the energy.

Some of the 21 functions fail in a way the authors treat as a limit of local learning. bcm_local and outlier_trimmed_energy_local sometimes learn no usable representation. On MNIST, a balanced set of ten classes, the BCM run lands at chance. Their account is instability in a greedy, layer-wise regime. The BCM threshold slides with the statistics of the stream. Without a global error signal to correct a runaway update, the threshold can fail to settle, and units can saturate or go silent. Trimming outliers can discard signal along with the extremes. The stated limit is that these local rules need careful tuning and homeostatic mechanisms if they are to stay stable. Global optimizers, the authors note, often take that stability for granted.

The preprint is at https://arxiv.org/abs/2511.18567, and the code is at https://github.com/aryashah2k/In-Search-of-Goodness.
