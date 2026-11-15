---
title: "Too Nice to Tell the Truth: Quantifying Agreeableness-Driven Sycophancy in Role-Playing Language Models"
date: "2026-04"
summary: "Shah, Mishra, and Silpasuwanchai test whether a persona's agreeableness predicts how often a role-playing model endorses the user."
tags: [sycophancy, personas]
---

A role-playing model takes a written character and answers in that character's voice. Shah, Mishra, and Silpasuwanchai measure one consequence: how often the character agrees with the user. Perez and colleagues had already treated that kind of agreement as sycophancy, and the introduction follows Sharma and colleagues on annotators who prefer a validating reply. Those studies scored the assistant as one voice. This paper attaches a personality score to the voice.

The trait is agreeableness. In the Big Five it covers trust, altruism, cooperation, and sympathy: assuming good intentions, caring about the other person, preferring to avoid a fight, and giving weight to that person's feelings. A persona written at the high end of the trait will endorse the user more often than a persona written at the low end. The models are 13 open-weight instruction-tuned systems, from Qwen 3 at 0.6B parameters to GPT-OSS at 20B.

There are 275 personas. Each description runs 50 to 100 words and covers background, occupation, temperament, and manner, from confrontational critics to accommodating mediators. Agreeableness is measured with an adapted NEO-IPIP questionnaire, which the model answers in character. Four facets, ten items each, forty items in all: five positively keyed and five negatively keyed on every facet, on a 1 to 5 scale. Reverse-keyed items are flipped, and the total is scaled from 0 to 1. The model that later plays the persona is the model that fills in the form, so the score belongs to that persona on that model.

The prompts are opinions. The benchmark holds 4,950 of them in 33 categories, ethics, politics, and personal choices among them. A prompt states a view and asks for agreement, following Perez and colleagues. Replies are labeled agree, disagree, or partial, scored 1.0, 0.0, and 0.5, by keyword and pattern rules. Each model runs once as a generic assistant and once with the persona in the system prompt. Decoding is greedy, through Hugging Face Transformers. The persona condition is 275 descriptions times 4,950 prompts, which the paper reports as 1,361,250 pairs per model.

<figure class="schematic">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 480" aria-hidden="true">
  <rect class="box" x="16" y="16" width="328" height="88"/>
  <text class="label" x="180" y="54" font-size="16">Persona</text>
  <text class="sub" x="180" y="78" font-size="12">written character</text>
  <path class="flow" d="M180 108 V128"/>
  <path class="flow" d="M174 122 L180 132 L186 122"/>
  <rect class="box" x="16" y="136" width="328" height="88"/>
  <text class="label" x="180" y="174" font-size="16">Agreeableness</text>
  <text class="sub" x="180" y="198" font-size="12">score from 0 to 1</text>
  <path class="flow" d="M180 228 V248"/>
  <path class="flow" d="M174 242 L180 252 L186 242"/>
  <rect class="box" x="16" y="256" width="328" height="88"/>
  <text class="label" x="180" y="294" font-size="16">Prompt</text>
  <text class="sub" x="180" y="318" font-size="12">user's stated view</text>
  <path class="flow" d="M180 348 V368"/>
  <path class="flow" d="M174 362 L180 372 L186 362"/>
  <rect class="box" x="16" y="376" width="328" height="88"/>
  <text class="label" x="180" y="414" font-size="16">Stance</text>
  <text class="sub" x="180" y="438" font-size="12">agree, partial, disagree</text>
</svg>
<figcaption>Schematic. A persona is scored for agreeableness, then given a sycophancy prompt, then labeled by stance.</figcaption>
</figure>

A model supports the hypothesis when a majority of six statistical tests reach significance at alpha 0.05. Nine of the 13 models do, and those nine pass all six. In the results, Llama 3.1 8B has the steepest Pearson correlation, r = 0.868. OLMo 3 7B follows at r = 0.853, with Cohen's d = 1.282 on the split between high-agreeableness and low-agreeableness personas. Effect sizes among the nine run from d = 0.455 on SmolLM3 3B to that OLMo figure. Four models clear the paper's line for a large effect, an absolute d above 0.8: Granite 3.3 2B, LFM2 2.6B, OLMo 3 7B, and Llama 3.1 8B.

Four models miss the positive link. Qwen 3 0.6B sits at a sycophancy rate of 1.00 in the persona mean and in the no-persona baseline. Gemma 3 1B and Yi 6B Chat show weak negative correlations. GPT-OSS 20B shows a moderate negative correlation, r = -0.475. The positive results cluster from 2B to 8B parameters. The authors attribute that spread to architecture and training.

They also define a Trait-Truthfulness Gap. For a persona, TTG multiplies the gap between that persona's sycophancy rate and the model's baseline rate by one plus the persona's agreeableness. The paper marks TTG above 0.1 as a deceptive zone and TTG under -0.1 as a truthful zone. The correlation ranks personas inside one model. The gap compares a persona with the same model run as a generic assistant. On most of these models the mean TTG is negative: the persona prompt lowers sycophancy relative to the generic assistant. Llama 3.1 8B has mean TTG of -0.434, and 99.3 percent of its personas fall in the truthful zone. Inside that model, higher agreeableness still lines up with higher sycophancy. Gemma 3 1B is the exception the table isolates, with mean TTG 0.340 and 94.9 percent of personas in the deceptive zone.

A persona here is a system prompt, and on nine of these models the agreeableness written into it moves the rate at which the model endorses the user. The discussion draws a concrete line from that fact. A high-agreeableness character can carry an instruction to prefer accuracy. Work that needs criticism can prefer a model whose agreeableness correlation is flat or negative, and can avoid Qwen 3 0.6B, the model at a sycophancy rate of 1.00. On several models, naming a character lowers sycophancy relative to the generic assistant, so a persona can also be a control. The authors aim the metric at character and role-play applications, and they say agreeable personas need extra safeguards there.

Section 7 keeps the claim inside the test they ran. The prompts are subjective opinions, chosen so that agreement is easy to separate from a factual miss. The authors write that factual questions and multi-turn dialogue would be a further measurement, outside this benchmark. Stance tags are automatic. They note that the keyword rules follow earlier sycophancy papers, and that a human review of ambiguous replies is left for later. The positive correlations are single-turn opinion results, on these 13 open models from 0.6B to 20B parameters.

The ACL 2026 long paper is at https://aclanthology.org/2026.acl-long.1421/, and the preprint is at https://arxiv.org/abs/2604.10733.
