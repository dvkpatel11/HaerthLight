// import express from 'express';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import Replicate from 'replicate';

// export const generateRouter = express.Router();

// const THEMES = {
//   'golden-warmth': {
//     label: 'Golden Warmth',
//     imagePrompt: 'warm golden hour light, soft bokeh, autumn leaves, amber tones, cinematic depth of field, photorealistic, 8k',
//   },
//   'midnight-bloom': {
//     label: 'Midnight Bloom',
//     imagePrompt: 'midnight garden, moonlit flowers blooming in darkness, deep indigo and violet tones, ethereal glow, cinematic, 8k',
//   },
//   'ocean-calm': {
//     label: 'Ocean Calm',
//     imagePrompt: 'serene ocean at dawn, soft teal and pearl light, gentle waves, mist on water, peaceful, photorealistic, 8k',
//   },
//   'forest-dawn': {
//     label: 'Forest Dawn',
//     imagePrompt: 'misty forest at dawn, shafts of golden light through ancient trees, emerald and gold tones, cinematic atmosphere, 8k',
//   },
//   'celestial': {
//     label: 'Celestial',
//     imagePrompt: 'deep cosmos, nebula in rose gold and midnight blue, stars, vast and intimate simultaneously, cinematic space photography, 8k',
//   },
// };

// function buildProsePrompt({ recipient, occasion, narrative }) {
//   return `You are an elegant literary author crafting a deeply personal, heartfelt message.

// Write a beautifully composed personal message for the following occasion. The writing should feel warm, intimate, and genuinely meaningful — not generic.

// Tone: ${narrative.tone}
// Recipient name: ${recipient.name}
// Relationship: ${recipient.relationship}
// Age: ${recipient.age || 'not specified'}
// Occasion: ${occasion.label}
// Occasion date: ${occasion.date || 'soon'}
// ${narrative.sharedMemory ? `A shared memory or detail to weave in: ${narrative.sharedMemory}` : ''}
// ${narrative.traits ? `Their notable qualities: ${narrative.traits}` : ''}
// ${narrative.notes ? `Additional context: ${narrative.notes}` : ''}

// Instructions:
// - Write 3–5 paragraphs. No titles or headers.
// - Do not use clichés or generic birthday phrases.
// - Weave in specific details naturally — they should feel discovered, not listed.
// - The final paragraph should feel like a genuine, specific wish for their future.
// - Style: literary, warm, unhurried. Like a letter from someone who truly sees them.
// - Write in second person (you / your).
// - Do not include a salutation or sign-off — just the prose body.`;
// }

// // Generate prose via Gemini
// generateRouter.post('/prose', async (req, res) => {
//   try {
//     const apiKey = process.env.GEMINI_API_KEY;
//     if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY not configured' });

//     const genAI = new GoogleGenerativeAI(apiKey);
//     const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

//     const prompt = buildProsePrompt(req.body);
//     const result = await model.generateContent(prompt);
//     const prose = result.response.text().trim();

//     res.json({ prose });
//   } catch (err) {
//     console.error('Gemini error:', err);
//     res.status(500).json({ error: 'Generation failed', detail: err.message });
//   }
// });

// // Generate background image via Replicate
// generateRouter.post('/image', async (req, res) => {
//   try {
//     const apiKey = process.env.REPLICATE_API_KEY;
//     if (!apiKey) return res.status(500).json({ error: 'REPLICATE_API_KEY not configured' });

//     const { theme } = req.body;
//     const themeConfig = THEMES[theme] || THEMES['golden-warmth'];

//     const replicate = new Replicate({ auth: apiKey });

//     const output = await replicate.run(
//       'stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b',
//       {
//         input: {
//           prompt: themeConfig.imagePrompt,
//           negative_prompt: 'text, watermark, people, faces, blurry, low quality, cartoon',
//           width: 1344,
//           height: 768,
//           num_inference_steps: 30,
//           guidance_scale: 7.5,
//         },
//       }
//     );

//     const imageUrl = Array.isArray(output) ? output[0] : output;
//     res.json({ imageUrl });
//   } catch (err) {
//     console.error('Replicate error:', err);
//     res.status(500).json({ error: 'Image generation failed', detail: err.message });
//   }
// });

// export { THEMES };
import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";

export const generateRouter = express.Router();

const THEMES = {
  "golden-warmth": {
    label: "Golden Warmth",
    imagePrompt:
      "warm golden hour light, soft bokeh, autumn leaves, amber tones, cinematic depth of field, photorealistic, 8k, no people, no text",
  },
  "midnight-bloom": {
    label: "Midnight Bloom",
    imagePrompt:
      "midnight garden, moonlit flowers blooming in darkness, deep indigo and violet tones, ethereal glow, cinematic, 8k, no people, no text",
  },
  "ocean-calm": {
    label: "Ocean Calm",
    imagePrompt:
      "serene ocean at dawn, soft teal and pearl light, gentle waves, mist on water, peaceful, photorealistic, 8k, no people, no text",
  },
  "forest-dawn": {
    label: "Forest Dawn",
    imagePrompt:
      "misty forest at dawn, shafts of golden light through ancient trees, emerald and gold tones, cinematic atmosphere, 8k, no people, no text",
  },
  celestial: {
    label: "Celestial",
    imagePrompt:
      "deep cosmos, nebula in rose gold and midnight blue, stars, vast and intimate simultaneously, cinematic space photography, 8k, no people, no text",
  },
};

function buildProsePrompt(body) {
  const { recipient = {}, occasion = {}, narrative = {}, narrativeContext } = body || {};

  const ctx = narrativeContext || {};

  const subject = ctx.subject || {};
  const relationshipPerspective = ctx.relationshipPerspective || {};
  const settingMood = ctx.settingMood || {};
  const lifeContext = ctx.lifeContext || {};
  const connectionSignal = ctx.connectionSignal || {};
  const messageIntent = ctx.messageIntent || {};
  const closingStyle = ctx.closingStyle || {};
  const styleLayer = ctx.styleLayer || {};

  const traitsFromContext = Array.isArray(ctx.traits) ? ctx.traits : [];
  const traitsFromLegacy =
    typeof narrative.traits === "string"
      ? narrative.traits
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
  const allTraits = traitsFromContext.length ? traitsFromContext : traitsFromLegacy;

  const displayName = subject.displayName || recipient.name || "them";
  const milestone = subject.milestone || occasion.label || "";
  const lifePhase = subject.lifePhase || "";

  const behaviorExample =
    ctx.behaviorExample ||
    connectionSignal.behaviorOrDynamic ||
    narrative.sharedMemory ||
    "";

  const relationshipType =
    relationshipPerspective.relationshipType || recipient.relationship || "";
  const narratorPersona = relationshipPerspective.narratorPersona || "";
  const emotionalStance = relationshipPerspective.emotionalStance || "";

  const environmentMood = settingMood.environmentMood || "";
  const symbolicStyle = settingMood.symbolicStyle || "";
  const emotionalAtmosphere = settingMood.emotionalAtmosphere || "";

  const recentChallenges = lifeContext.recentChallenges || "";
  const transitionMoment = lifeContext.transitionMoment || "";
  const chapterTone = lifeContext.chapterTone || narrative.tone || "";

  const sharedMemoryTone =
    connectionSignal.sharedMemoryTone || narrative.sharedMemory || "";
  const whyTheyMatter = connectionSignal.whyTheyMatter || "";

  const primaryGoal = messageIntent.primaryGoal || "celebrate";
  const emotionalMix = Array.isArray(messageIntent.emotionalMix)
    ? messageIntent.emotionalMix
    : ["warm"];

  const wishIntensity = closingStyle.wishIntensity || "poetic";
  const futureOrientation = closingStyle.futureOrientation || "";

  const literaryStyle =
    styleLayer.literaryStyle ||
    "modern literary, gently luminous, intimate";
  const metaphorDensity = styleLayer.metaphorDensity || "medium";

  const traitsLine = allTraits.length
    ? `Core traits: ${allTraits.join(", ")}.`
    : "";

  const emotionalMixLine = emotionalMix.length
    ? `Emotional mix: ${emotionalMix.join(", ")}.`
    : "";

  const settingLines = [
    environmentMood && `Environment: ${environmentMood}.`,
    symbolicStyle && `Symbolic setting style: ${symbolicStyle}.`,
    emotionalAtmosphere && `Atmosphere: ${emotionalAtmosphere}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const lifeContextLines = [
    milestone && `Milestone or moment: ${milestone}.`,
    lifePhase && `Life phase descriptor: ${lifePhase}.`,
    transitionMoment && `Current transition or chapter: ${transitionMoment}.`,
    recentChallenges && `Recent responsibilities or challenges: ${recentChallenges}.`,
    chapterTone && `Emotional tone of this chapter: ${chapterTone}.`,
  ]
    .filter(Boolean)
    .join("\n");

  const connectionLines = [
    behaviorExample &&
      `One small behavior or dynamic that captures the relationship: ${behaviorExample}.`,
    sharedMemoryTone &&
      `Shared memory tone or moment to gently weave in: ${sharedMemoryTone}.`,
    whyTheyMatter && `Why they matter to the narrator: ${whyTheyMatter}.`,
  ]
    .filter(Boolean)
    .join("\n");

  return `You are an elegant literary author crafting a deeply personal, heartfelt message.

Write a beautifully composed personal message for the following person and moment. The writing should feel warm, intimate, and genuinely meaningful - not generic.

=== Subject identity ===
Recipient display name: ${displayName}
Relationship archetype: ${relationshipType || "unspecified"}
${lifeContextLines || ""}

${traitsLine || ""}

=== Relationship perspective ===
Narrator relationship: ${relationshipType || "unspecified"}
Narrator persona: ${narratorPersona || "a quiet, observant voice"}
Emotional stance toward them: ${emotionalStance || "tender admiration and care"}

=== Setting mood ===
${settingLines || "Use a subtle, atmospheric backdrop that fits the tone."}

=== Connection signal ===
${connectionLines || "Let the relationship feel specific and lived-in, not abstract."}

=== Message intent ===
Primary goal: ${primaryGoal}
${emotionalMixLine || "Emotional mix: warm."}

=== Closing wish style ===
Closing intensity: ${wishIntensity}
Future orientation: ${futureOrientation || "Offer a blessing for the chapters ahead, grounded in who they already are."}

=== Style layer ===
Literary style: ${literaryStyle}
Metaphor density: ${metaphorDensity}

=== Additional guidance ===
- Prioritize emotional specificity over plot detail.
- You may gently infer connective tissue between details, but do not invent elaborate fictional events.
- Weave in any mentioned traits or moments so they feel discovered inside the prose rather than listed.
- Write 3-5 paragraphs of continuous prose. No titles or section headers.
- Do not use clichés or generic celebration phrases.
- The final paragraph should feel like a genuine, specific wish for their future in this chapter.
- Style: ${literaryStyle}, unhurried and humane.
- Write in second person (you / your).
- Do not include a salutation or sign-off — only the body of the message.`;
}

// Generate prose via Gemini
generateRouter.post("/prose", async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "GEMINI_API_KEY not configured" });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = buildProsePrompt(req.body);
    const result = await model.generateContent(prompt);
    const prose = result.response.text().trim();

    res.json({ prose });
  } catch (err) {
    console.error("Gemini error:", err);
    res.status(500).json({ error: "Generation failed", detail: err.message });
  }
});

async function generateThemeImage(body) {
  const apiKey = process.env.REPLICATE_API_KEY;
  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY not configured");
  }

  const { theme, recipient = {}, occasion = {}, narrative = {}, narrativeContext = {} } =
    body || {};

  const themeConfig = THEMES[theme] || THEMES["golden-warmth"];
  const basePrompt = themeConfig.imagePrompt;

  const relationship =
    (narrativeContext.relationshipPerspective &&
      narrativeContext.relationshipPerspective.relationshipType) ||
    recipient.relationship ||
    "someone dear to the narrator";

  const tone =
    (narrativeContext.lifeContext && narrativeContext.lifeContext.chapterTone) ||
    narrative.tone ||
    "warm & heartfelt";

  const environment =
    (narrativeContext.settingMood && narrativeContext.settingMood.environmentMood) || "";
  const atmosphere =
    (narrativeContext.settingMood && narrativeContext.settingMood.emotionalAtmosphere) || "";

  const occasionLabel = occasion.label || "a special moment";

  const detailParts = [
    `for a ${tone.toLowerCase()} chronicle about ${relationship}`,
    `set around ${occasionLabel.toLowerCase()}`,
    environment && `environment: ${environment}`,
    atmosphere && `atmosphere: ${atmosphere}`,
    "no people, no faces, no text, wholesome, respectful, no explicit content, no violence",
  ]
    .filter(Boolean)
    .join(", ");

  const prompt = `${basePrompt}, ${detailParts}`;

  const version =
    "39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b";

  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version,
      input: {
        prompt,
        negative_prompt:
          "text, watermark, people, faces, blurry, low quality, cartoon",
        width: 1344,
        height: 768,
        num_inference_steps: 30,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(
      `Replicate create failed: ${createRes.status} ${createRes.statusText} ${errBody}`
    );
  }

  let prediction = await createRes.json();

  // Poll until the prediction is finished
  // Limit total wait to avoid hanging indefinitely
  const maxAttempts = 20;
  const pollIntervalMs = 1500;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const pollRes = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!pollRes.ok) {
      const errBody = await pollRes.text();
      throw new Error(
        `Replicate poll failed: ${pollRes.status} ${pollRes.statusText} ${errBody}`
      );
    }

    prediction = await pollRes.json();
  }

  if (prediction.status !== "succeeded") {
    throw new Error(
      prediction.error || `Replicate prediction ${prediction.status || "failed"}`
    );
  }

  const output = prediction.output;
  const imageUrl = Array.isArray(output) ? output[0] : output;

  if (!imageUrl) {
    throw new Error("Replicate returned no image URL");
  }

  return imageUrl;
}

async function generateThemeAnimation(body) {
  const apiKey = process.env.REPLICATE_API_KEY;
  const videoVersion = process.env.REPLICATE_VIDEO_VERSION;

  if (!apiKey) {
    throw new Error("REPLICATE_API_KEY not configured");
  }
  if (!videoVersion) {
    throw new Error("REPLICATE_VIDEO_VERSION not configured");
  }

  const { theme, recipient = {}, occasion = {}, narrative = {}, narrativeContext = {} } =
    body || {};

  const themeConfig = THEMES[theme] || THEMES["golden-warmth"];
  const basePrompt = themeConfig.imagePrompt;

  const relationship =
    (narrativeContext.relationshipPerspective &&
      narrativeContext.relationshipPerspective.relationshipType) ||
    recipient.relationship ||
    "someone dear to the narrator";

  const tone =
    (narrativeContext.lifeContext && narrativeContext.lifeContext.chapterTone) ||
    narrative.tone ||
    "warm & heartfelt";

  const environment =
    (narrativeContext.settingMood && narrativeContext.settingMood.environmentMood) || "";
  const atmosphere =
    (narrativeContext.settingMood && narrativeContext.settingMood.emotionalAtmosphere) || "";

  const occasionLabel = occasion.label || "a special moment";

  const detailParts = [
    `short, subtle looping motion`,
    `for a ${tone.toLowerCase()} chronicle about ${relationship}`,
    `set around ${occasionLabel.toLowerCase()}`,
    environment && `environment: ${environment}`,
    atmosphere && `atmosphere: ${atmosphere}`,
    "no people, no faces, no text, wholesome, respectful, no explicit content, no violence",
  ]
    .filter(Boolean)
    .join(", ");

  const prompt = `${basePrompt}, ${detailParts}`;

  const createRes = await fetch("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      Authorization: `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: videoVersion,
      input: {
        prompt,
      },
    }),
  });

  if (!createRes.ok) {
    const errBody = await createRes.text();
    throw new Error(
      `Replicate video create failed: ${createRes.status} ${createRes.statusText} ${errBody}`
    );
  }

  let prediction = await createRes.json();

  const maxAttempts = 40;
  const pollIntervalMs = 1500;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    if (
      prediction.status === "succeeded" ||
      prediction.status === "failed" ||
      prediction.status === "canceled"
    ) {
      break;
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    const pollRes = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: {
          Authorization: `Token ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!pollRes.ok) {
      const errBody = await pollRes.text();
      throw new Error(
        `Replicate video poll failed: ${pollRes.status} ${pollRes.statusText} ${errBody}`
      );
    }

    prediction = await pollRes.json();
  }

  if (prediction.status !== "succeeded") {
    throw new Error(
      prediction.error || `Replicate video prediction ${prediction.status || "failed"}`
    );
  }

  const output = prediction.output;
  const animationUrl = Array.isArray(output) ? output[0] : output;

  if (!animationUrl) {
    throw new Error("Replicate returned no animation URL");
  }

  return animationUrl;
}

// Generate themed background image via external OSS model (Replicate SDXL)
generateRouter.post("/image", async (req, res) => {
  try {
    const imageUrl = await generateThemeImage(req.body);
    res.json({ imageUrl });
  } catch (err) {
    console.error("Image generation error:", err);

    if (err instanceof Error && /REPLICATE_API_KEY not configured/i.test(err.message)) {
      return res
        .status(500)
        .json({ error: "Image generation not configured (REPLICATE_API_KEY missing)" });
    }

    return res
      .status(500)
      .json({
        error: "Image generation failed",
        detail: err instanceof Error ? err.message : String(err),
      });
  }
});

// Generate short looping animation via external OSS video model on Replicate
generateRouter.post("/animation", async (req, res) => {
  try {
    const animationUrl = await generateThemeAnimation(req.body);
    res.json({ animationUrl });
  } catch (err) {
    console.error("Animation generation error:", err);

    if (err instanceof Error) {
      if (/REPLICATE_API_KEY not configured/i.test(err.message)) {
        return res
          .status(500)
          .json({ error: "Animation generation not configured (REPLICATE_API_KEY missing)" });
      }
      if (/REPLICATE_VIDEO_VERSION not configured/i.test(err.message)) {
        return res
          .status(500)
          .json({ error: "Animation generation not configured (REPLICATE_VIDEO_VERSION missing)" });
      }
    }

    return res
      .status(500)
      .json({
        error: "Animation generation failed",
        detail: err instanceof Error ? err.message : String(err),
      });
  }
});

export { THEMES };
