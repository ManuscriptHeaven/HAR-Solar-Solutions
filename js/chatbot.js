/* ==========================================
   HAR SOLAR SOLUTIONS - AI Chatbot
   Powered by Groq LLaMA API
   ========================================== */

(function () {

    // ——————————————————————————————————————
    // 1. CONFIG
    // API key is loaded from js/config.js (not committed to Git)
    // ——————————————————————————————————————
    const GROQ_API_KEY  = (window.HAR_CONFIG && window.HAR_CONFIG.groqKey) || '';
    const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
    const MODEL         = 'llama3-8b-8192';

    // System prompt — trains the bot as a HAR Solar expert
    const SYSTEM_PROMPT = `You are "HAR Solar Assistant", an expert AI chatbot for HAR Solar Solutions — a professional solar energy installation company based in Lahore, Pakistan.

Your job is to help potential customers understand solar energy, HAR Solar's services, pricing, and answer any questions they have.

## About HAR Solar Solutions:
- Services: Residential Solar Systems, Commercial Solar Systems, Maintenance & Servicing
- Location: Gulberg III, Lahore, Pakistan
- Phone: +92 300 1234567
- Email: info@harsolar.com
- We use only Tier-1 international brand solar panels and inverters
- We offer long-term warranties on all panels and inverters
- Professional engineers handle all installations
- NEPRA Net Metering certified

## Pricing Guide (approximate):
- 3 kW System (small home): ~PKR 450,000 - 550,000
- 5 kW System (medium home): ~PKR 700,000 - 850,000
- 10 kW System (large home/office): ~PKR 1,300,000 - 1,600,000
- Per kW cost: ~PKR 150,000
- Monthly savings: ~90% of electricity bill
- Payback period: 2.5 - 4 years typically

## Key Facts:
- Average electricity rate in Pakistan: ~PKR 50 per unit
- 1 kW solar system = ~120 units/month
- Net metering allows selling extra electricity back to DISCO
- Panels last 25+ years, inverters 10-15 years

## Rules:
- Always reply in the same language the user writes in (Urdu/Roman Urdu or English)
- Be friendly, helpful, and professional
- Keep answers concise (2-4 sentences max unless detail is needed)
- Always encourage users to call or get a free quote for exact pricing
- Never make up facts — if unsure, say "Contact our team for exact details: +92 300 1234567"
- Do not discuss topics unrelated to solar energy or HAR Solar Solutions`;

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
                "Assalam o Alaikum! 🌞 I'm your HAR Solar Assistant.\n\nAap solar panels, pricing, ya kisi bhi solar service ke baare mein mujhse pooch sakte hain!",
                [
                    "💰 Solar ki pricing kya hai?",
                    "⚡ Mera bill 30,000 PKR hai",
                    "🏠 Ghar ke liye system",
                    "📞 Contact karein"
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
        bubble.className = 'msg-bubble';
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
        bubble.className = 'msg-bubble';
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
            const response = await fetch(GROQ_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: MODEL,
                    messages: messages,
                    max_tokens: 512,
                    temperature: 0.7,
                    stream: false
                })
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            const reply = data.choices[0]?.message?.content?.trim();

            if (!reply) throw new Error('Empty response');

            // Push assistant reply to history
            messages.push({ role: 'assistant', content: reply });

            // Render bot bubble
            removeTypingIndicator();
            addBotMessage(reply);

        } catch (err) {
            console.error('Chatbot error:', err);
            removeTypingIndicator();
            addBotMessage(
                "Sorry, abhi kuch technical masla aa gaya. Please thodi der baad try karein ya humein directly call karein:\n📞 +92 300 1234567"
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
