# Prompt Edit Studio — Edit Like a Pro, Without the Learning Curve

**Prompt Edit Studio** is an in-browser photo editing experience powered by **Generative UI**.  
Instead of AI editing your image automatically, Prompt Edit Studio **guides you step-by-step** through professional editing controls using natural language.

Upload an image → describe the vibe you want → get **tool recommendations, exact values, and explanations** → edit like a real creator.

> **Match the Lightroom edit you imagined—right in your browser, without the learning curve.**

---

## ✨ Why Prompt Edit Studio?

Most AI editors:

- Edit the image **for you**
- Hide the **creative process**
- Produce **hallucinated or inconsistent** results

**Prompt Edit Studio is different.**

- Keeps **humans in control**
- Uses AI to **recommend UI actions**, not replace them
- Teaches **real editing concepts** while you create

**Result:**  
You **learn editing** while achieving **professional aesthetics** in minutes.

---

## 🎯 Problem

Beginner creators struggle because:

1. Editing tools have **too many sliders, knobs, and panels**
2. Users don’t know:
   - When to use **dehaze, tint, exposure, grain, fade**
   - What **exact values** create a specific aesthetic (eg: old money, dreamy..)
3. AI auto-editing removes **skill-building** from the process

---

## 💡 Solution — Conversational Editing Guidance

Prompt Edit Studio introduces **AI-guided manual editing**:

- Describe a look in **natural language**  
  _Example: “old money fallen angel cinematic tone”_
- AI recommends:
  - **Which tools** to use
  - **Exact slider values**
  - **Step-by-step workflow**
  - **Why** each adjustment matters
- You perform the edit manually → **true learning + creative control**
- Don't like the slider values recommeded? Increase or decrease according to what suits your eye.

> AI becomes a **creative mentor**, not a replacement.

---

## 🧠 Core Experience Flow

### 1. Upload  
Upload an image directly in the browser.

### 2. Command  
Describe the desired aesthetic in plain English.

### 3. Guidance (Generative UI)  
AI provides:

- Tool recommendations  
- Exact parameter values  
- Step-by-step instructions  
- Educational explanations  

### 4. Human Editing  
User applies edits using the UI and **learns by doing**.

---

## 🛠 Editing Features

### Filters & Effects
- Grayscale  
- Invert  
- Sepia / Sepia2  
- Blur  
- Sharpen  
- Emboss  
- Pixelate  
- Color Filter  

### Adjustments
- Remove White (with distance control)  
- Brightness  
- Noise  
- Color filter threshold control  

### Blend & Tint Controls
- Tint  
- Multiply  
- Blend  

### Canvas Tools
- Crop  
- Flip / Rotate  
- Draw  
- Shapes  
- Text  
- Icons  
- Resize / Settings  

---

## 🧩 Tech Stack

### Frontend
- **Vite React** — routing & app structure  
- **Tailwind CSS + shadcn/ui + tui image editor** — design system  
- **Framer Motion** — animations & micro-interactions  
- **Lucide React** — icons  

### Generative Layer
- **Tambo** — Generative UI orchestration  
- **Fine-tuned LLM guidance**  
- **Conversational side-chat assistant**

### Data & Mocking
- **Mock Service Worker**  
- **Local JSON configs**

### Deployment
- **Vercel**

---

## 🖥 App Structure

### Landing Page
- Product intro  

### Editing Workspace
- Beautified editing UI  
- Real-time parameter control  
- Generative recommendation panel  

### AI Side Chat
- Continuous conversation  
- Adjustment suggestions  
- Educational explanations  

---

## 📊 Market Positioning

| Traditional AI Editors | SmartEdits |
|------------------------|-----------|
| Edits **for** you | Guides **you** |
| No learning | Skill-building |
| Hidden logic | Transparent reasoning |
| One-click output | Creative control |

**Prompt Edit Studio = Canva simplicity × Lightroom learning × AI guidance**

---

## 🚀 Vision

To help anyone recreate the edits they admire—  
right in the browser,  
without the frustration of guessing values or climbing a steep learning curve.

Where:

- Inspiration from platforms like TikTok becomes **achievable, not intimidating**
- Editing happens **instantly in the browser**, with no complex setup
- AI serves as a **guide to exact values and steps**, reducing trial and error
- The learning curve of professional editing is **significantly lowered for beginners**
  
---

## 🧪 Built With Support From

- **Tambo** — Generative UI orchestration  
- **Charlie Labs** — autonomous TypeScript engineer 

---

## 📦 Getting Started

```bash
git clone https://github.com/silvrfur/prompt-edit.git
cd prompt-edit
npm install
npm run dev

