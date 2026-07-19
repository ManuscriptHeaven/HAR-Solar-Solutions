/* ==========================================
   HAR SOLAR SOLUTIONS - AI Chatbot
   Powered by Groq LLaMA API
   ========================================== */

(function () {

    // ——————————————————————————————————————
    // 1. CONFIG
    // API key is loaded from js/config.js (not committed to Git)
    // Key is read lazily at call-time so config.js timing doesn't matter
    // ——————————————————————————————————————
    const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
    const MODEL         = 'llama-3.1-8b-instant'; // Updated: correct Groq model name

    function getApiKey() {
        return (window.HAR_CONFIG && window.HAR_CONFIG.groqKey) || '';
    }

    // System prompt — HAR Solar AI Sales Consultant (4-Step Flow)
    const SYSTEM_PROMPT = `You are the official AI Sales and Technical Consultant for "HAR Solar Solutions" — a professional solar installation company based in Lahore, Pakistan. You are polite, professional, and a solar energy expert.

## LANGUAGE RULES (Highest Priority — Never Break These):
You support exactly 3 language modes. Auto-detect from the user's first message and NEVER switch:

1. **Roman Urdu** — User types in Urdu words using English letters (e.g. "mujhe solar lagwana hai", "price kya hai")
   → Reply FULLY in Roman Urdu. Never use Urdu script (اردو) in Roman Urdu replies.

2. **English** — User types in English (e.g. "I want to install solar")
   → Reply FULLY in English. Never mix Urdu.

3. **Urdu Script (اردو)** — User types in actual Urdu/Arabic script (e.g. "مجھے سولر لگوانا ہے")
   → Reply FULLY in Urdu Nastaliq script. Never switch to Roman Urdu.

Never mix languages in a single reply. Match EXACTLY what the user writes.

---

## 4-STEP SALES FLOW (Follow strictly — never skip or merge steps):

### STEP 1 — Greeting & Load Assessment:
- Greet the user warmly: "Welcome to HAR Solar Solutions! ☀️"
- Then ask ONLY this ONE question:
  "Apka monthly electricity bill kitna aata hai (rupees mein), ya aap kitne ACs use karte hain?"
- Wait for the answer. Do NOT ask anything else in this message.

### STEP 2 — Recommend System Size:
- Analyze the user's input and suggest the correct solar system size using this logic:
  • No AC / Basic load (bill < 15,000 PKR): Suggest 3 kW
  • 1-2 ACs / Medium load (bill 15,000-40,000 PKR): Suggest 5 kW
  • 3+ ACs / Heavy load (bill > 40,000 PKR): Suggest 10 kW or more
- Briefly explain WHY this kW size is ideal for their load.
- Then ask: "Kya main aapko is size ke liye packages bata dun?" (or English/Urdu equivalent)
- Wait for confirmation before moving to Step 3.

### STEP 3 — 3-Tier Quotation:
- Only after Step 2 confirmation, present exactly 3 packages for their recommended system size.
- Format them clearly like this:

  🥇 Premium Package (Tier 1):
  • Panels: N-Type Jinko/Longi (Top Brand)
  • Inverter: Huawei / Growatt Hybrid
  • Battery: Lithium-Ion
  • Estimated Price: [give range for their kW size]
  • Best for: Maximum efficiency & 25+ year performance

  🥈 Standard Package (Tier 2):
  • Panels: Standard Tier-1 Panels
  • Inverter: Reliable Hybrid Inverter
  • Battery: Tubular / Lead-Acid
  • Estimated Price: [give range for their kW size]
  • Best for: Best value for money

  🥉 Economy Package (Tier 3):
  • Panels: Standard Reliable Panels
  • Inverter: On-Grid Inverter (No Battery)
  • Battery: None (works with Wapda only)
  • Estimated Price: [give range for their kW size]
  • Best for: Lowest upfront cost

- Always add this disclaimer: "⚠️ Yeh estimated prices hain. Final quotation site visit ke baad di jayegi."

### STEP 4 — Lead Generation (Closing):
- After presenting packages, ask: "Aapka naam aur WhatsApp number share karein — hamari team free site survey arrange karegi!"
- Once they share their details, respond warmly:
  "Shukriya [Name]! 🎉 Hamari team 24 ghante mein aapse rabta karegi. Koi bhi sawal ho toh poochein!"

---

## STRICT RULES:
- NEVER skip steps. No quotation before knowing load (Step 1).
- Ask ONLY ONE question per message. Never bombard with multiple questions.
- Be concise and natural — like a friendly human sales rep, not a robot.
- NEVER make up prices outside these ranges:
  • 3 kW: PKR 4,50,000 – 7,50,000 (Tier 1 to 3)
  • 5 kW: PKR 7,00,000 – 12,00,000
  • 10 kW: PKR 13,00,000 – 22,00,000
- If user asks something unrelated to solar, politely redirect: "Main sirf solar energy ke baare mein help kar sakta hoon. Koi solar sawal ho?"`;



    // ——————————————————————————————————————
    // 1b. LANGUAGE DIRECTION DETECTOR
    // Returns 'rtl' if text contains Urdu/Arabic script,
    // returns 'ltr' for Roman Urdu or English.
    // ——————————————————————————————————————
    function detectDir(text) {
        // Unicode range for Arabic/Urdu script characters
        const urduRegex = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;
        return urduRegex.test(text) ? 'rtl' : 'ltr';
    }

    // ——————————————————————————————————————
    // 2. DOM ELEMENTS
    // ——————————————————————————————————————
    const toggleBtn    = document.getElementById('chat-toggle-btn');
    const chatWindow   = document.getElementById('chat-window');
    const closeBtn     = document.getElementById('chat-close-btn');
    const messagesEl   = document.getElementById('chat-messages');
    const inputEl      = document.getElementById('chat-input');
    const sendBtn      = document.getElementById('chat-send-btn');
    const statusText   = document.getElementById('chat-status-text');
    const notifDot     = document.getElementById('chat-dot');
    const openIcon     = document.querySelector('.chat-toggle-icon.open-icon');
    const closeIcon    = document.querySelector('.chat-toggle-icon.close-icon');

    // Conversation history for multi-turn context
    let messages = [
        { role: 'system', content: SYSTEM_PROMPT }
    ];

    let isOpen    = false;
    let isLoading = false;

    // ——————————————————————————————————————
    // 3. INIT — Welcome Message + Quick Chips
    // ——————————————————————————————————————
    function init() {
        // Show welcome message after short delay
        setTimeout(() => {
            addBotMessage(
                "Welcome to HAR Solar Solutions! ☀️\n\nMain aapka AI Sales Consultant hoon. Main aapko bilkul sahi solar system select karne mein madad karoonga — step by step!\n\nShuru karne ke liye neeche se option chunein ya khud type karein 👇",
                [
                    "🔌 Mujhe solar lagwana hai",
                    "I want to install solar",
                    "مجھے سولر لگوانا ہے",
                    "💰 Pricing janni hai"
                ]
            );
        }, 600);
    }


    // ——————————————————————————————————————
    // 4. TOGGLE CHAT WINDOW
    // ——————————————————————————————————————
    function openChat() {
        isOpen = true;
        chatWindow.classList.add('open');
        openIcon.classList.add('hide');
        closeIcon.classList.remove('hide');
        notifDot.style.display = 'none';
        setTimeout(() => inputEl.focus(), 350);
    }

    function closeChat() {
        isOpen = false;
        chatWindow.classList.remove('open');
        closeIcon.classList.add('hide');
        openIcon.classList.remove('hide');
    }

    toggleBtn.addEventListener('click', () => {
        if (isOpen) closeChat(); else openChat();
    });
    closeBtn.addEventListener('click', closeChat);

    // ——————————————————————————————————————
    // 5. RENDER MESSAGES
    // ——————————————————————————————————————
    function addBotMessage(text, chips = []) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = '<i class="fa-solid fa-sun"></i>';

        const bubbleWrap = document.createElement('div');

        const bubble = document.createElement('div');
        // Auto-detect direction: Urdu script → rtl (right-align), otherwise → ltr (left-align)
        const dir = detectDir(text);
        bubble.className = `msg-bubble ${dir}`;
        bubble.innerHTML = text.replace(/\n/g, '<br>');

        bubbleWrap.appendChild(bubble);

        if (chips.length > 0) {
            const chipsEl = document.createElement('div');
            chipsEl.className = 'quick-chips';
            chips.forEach(chip => {
                const btn = document.createElement('button');
                btn.className = 'chip';
                btn.textContent = chip;
                btn.addEventListener('click', () => {
                    sendMessage(chip);
                    chipsEl.remove();
                });
                chipsEl.appendChild(btn);
            });
            bubbleWrap.appendChild(chipsEl);
        }

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubbleWrap);
        messagesEl.appendChild(wrapper);
        scrollToBottom();
    }

    function addUserMessage(text) {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg user';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = '<i class="fa-solid fa-user"></i>';

        const bubble = document.createElement('div');
        // Auto-detect direction: Urdu script → rtl (right-align), otherwise → ltr (left-align)
        const dir = detectDir(text);
        bubble.className = `msg-bubble ${dir}`;
        bubble.textContent = text;

        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        messagesEl.appendChild(wrapper);
        scrollToBottom();
    }

    function addTypingIndicator() {
        const wrapper = document.createElement('div');
        wrapper.className = 'chat-msg bot';
        wrapper.id = 'typing-msg';

        const avatar = document.createElement('div');
        avatar.className = 'msg-avatar';
        avatar.innerHTML = '<i class="fa-solid fa-sun"></i>';

        const bubble = document.createElement('div');
        bubble.className = 'msg-bubble';

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;

        bubble.appendChild(indicator);
        wrapper.appendChild(avatar);
        wrapper.appendChild(bubble);
        messagesEl.appendChild(wrapper);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const el = document.getElementById('typing-msg');
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    // ——————————————————————————————————————
    // 6. SEND MESSAGE & CALL GROQ API
    // ——————————————————————————————————————
    async function sendMessage(text) {
        if (!text || isLoading) return;

        const userText = text.trim();
        if (!userText) return;

        // Clear input
        inputEl.value = '';

        // Render user bubble
        addUserMessage(userText);

        // Push to conversation history
        messages.push({ role: 'user', content: userText });

        // Loading state
        isLoading = true;
        sendBtn.disabled = true;
        addTypingIndicator();
        statusText.textContent = 'Thinking...';
        statusText.classList.add('thinking');

        try {
            // Read key lazily at call time
            const apiKey = getApiKey();

            // Guard: key not loaded yet
            if (!apiKey) {
                removeTypingIndicator();
                addBotMessage(
                    '⚠️ API key nahi mili. Kindly js/config.js file check karein aur ensure karein ke window.HAR_CONFIG.groqKey set hai.'
                );
                return;
            }

            const response = await fetch(GROQ_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: messages,
                    max_tokens: 512,
                    temperature: 0.7,
                    stream: false
                })
            });

            // Parse error details if request fails
            if (!response.ok) {
                let errBody = '';
                try { errBody = JSON.stringify(await response.json()); } catch(_) {}
                console.error(`Groq API ${response.status}:`, errBody);
                throw new Error(`HTTP ${response.status}: ${errBody}`);
            }

            const data = await response.json();
            const reply = data.choices[0]?.message?.content?.trim();

            if (!reply) throw new Error('Empty response from Groq');

            // Push assistant reply to history
            messages.push({ role: 'assistant', content: reply });

            // Render bot bubble
            removeTypingIndicator();
            addBotMessage(reply);

        } catch (err) {
            console.error('Chatbot error:', err.message);
            removeTypingIndicator();
            // Show actual error details to help debug
            addBotMessage(
                `❌ Error: ${err.message}\n\nPlease call us directly:\n📞 +92 300 1234567`
            );
        } finally {
            isLoading = false;
            sendBtn.disabled = false;
            statusText.textContent = 'Online • Ready to help';
            statusText.classList.remove('thinking');
            inputEl.focus();
        }
    }

    // ——————————————————————————————————————
    // 7. INPUT EVENT HANDLERS
    // ——————————————————————————————————————
    sendBtn.addEventListener('click', () => {
        sendMessage(inputEl.value);
    });

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage(inputEl.value);
        }
    });

    // ——————————————————————————————————————
    // 8. SHOW NOTIFICATION DOT AFTER 3s
    //    (encourages user to open chat)
    // ——————————————————————————————————————
    setTimeout(() => {
        if (!isOpen) {
            notifDot.style.display = 'block';
        }
    }, 3000);

    // Start the bot
    init();

})();
