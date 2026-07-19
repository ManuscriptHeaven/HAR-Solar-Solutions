/* ==========================================
   HAR SOLAR SOLUTIONS - Premium App JavaScript
   Logic: Solar Calculator, Canvas Particles,
   3D Tilt Card, Translation Engine, UI States
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Translation Dictionary
    const translations = {
        ur: {
            // Navbar
            "nav-home": "مرکزی صفحہ",
            "nav-about": "ہمارے بارے میں",
            "nav-services": "خدمات",
            "nav-calculator": "کیلکولیٹر",
            "nav-why-us": "ہمیں کیوں؟",
            "btn-quote-nav": "مفت کوٹیشن",
            
            // Hero
            "hero-badge": "⚡ توانائی کا جدید ترین انقلاب",
            "hero-title": "HAR Solar Solutions <br><span class=\"gradient-text\">آپ کا روشن اور سستا مستقبل</span>",
            "hero-desc": "بجلی کے بھاری بلوں سے ہمیشہ کے لیے نجات پائیں۔ ہم آپ کے گھر، دفتر اور فیکٹری کے لیے جدید ترین اور مکمل سولر سلوشنز فراہم کرتے ہیں۔",
            "btn-quote": "مفت کوٹیشن حاصل کریں",
            "btn-calc": "بچت کا حساب لگائیں",
            "badge-tier-title": "ٹاپ ٹئیر کوالٹی",
            "badge-tier-desc": "Tier-1 سولر پینلز",
            
            // About
            "about-title": "ہم کون ہیں؟",
            "about-desc": "HAR Solar Solutions ایک بااعتماد اور مستند سولر انسٹالیشن کمپنی ہے۔ ہمارا مقصد پاکستان بھر میں سستی اور ماحول دوست توانائی کو فروغ دینا ہے۔ ہماری ماہرین کی ٹیم آپ کی ضرورت کے مطابق بہترین ڈیزائن، کوالٹی اور سروس کو یقینی بناتی ہے تاکہ آپ کا سولر سسٹم سالہا سال بہترین کارکردگی دکھا سکے۔",
            "stat-warranty": "سال وارنٹی",
            "stat-clients": "خوش گاہک",
            "stat-power": "انسٹال شدہ پاور",
            
            // Services
            "services-title": "ہماری خدمات",
            "services-subtitle": "ہم آپ کی ضروریات کے مطابق بہترین اور جدید سولر سسٹمز پیش کرتے ہیں",
            "service-res-title": "رہائشی سولر سسٹمز",
            "service-res-desc": "آپ کے گھر کے لیے مکمل طور پر کسٹمائزڈ سولر پینل سسٹمز، جو آپ کی بجلی کی ضروریات کو پورا کرتے ہیں۔",
            "service-com-title": "کمرشل سولر سسٹمز",
            "service-com-desc": "کاروبار اور فیکٹریوں کے لیے ہیوی ڈیوٹی سولر سلوشنز تاکہ آپ کی پیداواری لاگت میں نمایاں کمی آسکے۔",
            "service-maint-title": "مینٹیننس اور سروسنگ",
            "service-maint-desc": "پرانے سسٹمز کی صفائی، مرمت اور کارکردگی کو بہتر بنانے کے لیے ہماری آفٹر سیلز سروسز۔",
            "learn-more": "مزید جانیں",
            
            // Calculator
            "calc-title": "سولر بچت کیلکولیٹر",
            "calc-subtitle": "اپنے بجلی کے بل کے مطابق سولر سسٹم کے سائز اور متوقع بچت کا فوری اندازہ لگائیں",
            "calc-label-bill": "اپنا اوسط ماہانہ بجلی کا بل لکھیں (PKR):",
            "calc-label-slider": "بل کو تبدیل کریں:",
            "calc-info-note": "یہ تخمینہ اوسطاً 50 روپے فی یونٹ کی شرح اور سالانہ اوسط شمسی کارکردگی پر مبنی ہے۔ نیپرا نیٹ میٹرنگ کے فوائد بھی شامل ہیں۔",
            "calc-out-size": "سسٹم کا سائز",
            "calc-out-monthly": "ماہانہ بچت",
            "calc-out-payback": "پیسوں کی واپسی کا دورانیہ",
            "calc-out-lifetime": "25 سالہ بچت",
            "calc-years": "سال",
            
            // Why Us
            "why-title": "ہمیں کیوں منتخب کریں؟",
            "why-subtitle": "ہم معیار، بھروسے اور بہترین خدمات پر کوئی سمجھوتہ نہیں کرتے",
            "why-r1-title": "اعلیٰ معیار کا سامان",
            "why-r1-desc": "ہم صرف بین الاقوامی معیار کی ٹاپ ٹئیر (Tier-1) برانڈز استعمال کرتے ہیں۔",
            "why-r2-title": "پیشہ ورانہ انسٹالیشن",
            "why-r2-desc": "ہماری انجینئرز کی ٹیم ہر کام کو تکنیکی مہارت اور حفاظت کے ساتھ مکمل کرتی ہے۔",
            "why-r3-title": "بہترین وارنٹی",
            "why-r3-desc": "پینلز اور انورٹرز پر طویل مدتی وارنٹی کی بہترین سہولت فراہم کی جاتی ہے۔",
            
            // Contact
            "contact-title": "مفت کوٹیشن حاصل کریں",
            "contact-subtitle": "آج ہی اپنے سولر سسٹم کے لیے رابطہ کریں اور بجلی کے بھاری بلوں سے چھٹکارا حاصل کریں!",
            "c-phone": "فون نمبر",
            "c-email": "ای میل",
            "c-address": "دفتر کا پتہ",
            "c-address-val": "گلبرگ تھری، لاہور، پاکستان",
            "f-name": "آپ کا نام",
            "f-phone": "فون نمبر",
            "f-email": "ای میل ایڈریس",
            "f-type": "سسٹم کی قسم",
            "opt-res": "رہائشی سولر سسٹم (Residential)",
            "opt-com": "کمرشل سولر سسٹم (Commercial)",
            "opt-maint": "مینٹیننس اور سروس (Maintenance)",
            "f-msg": "مزید معلومات یا تفصیلات",
            "f-btn-submit": "درخواست جمع کروائیں",
            "success-title": "بہت شکریہ!",
            "success-msg": "آپ کی درخواست موصول ہو گئی ہے۔ ہمارا سولر کونسلر جلد ہی آپ سے رابطہ کرے گا۔",
            "btn-close": "بند کریں",
            
            // Footer
            "footer-desc": "بجلی کے بھاری بلوں سے نجات اور روشن پاکستان کے لیے آپ کا بااعتماد اور مستند پارٹنر۔",
            "foot-links-title": "فوری روابط",
            "foot-services-title": "ہماری خدمات",
            "footer-copy": "جملہ حقوق محفوظ ہیں۔"
        },
        en: {
            // Navbar
            "nav-home": "Home",
            "nav-about": "About Us",
            "nav-services": "Services",
            "nav-calculator": "Calculator",
            "nav-why-us": "Why Us",
            "btn-quote-nav": "Free Quote",
            
            // Hero
            "hero-badge": "⚡ The Ultimate Energy Revolution",
            "hero-title": "HAR Solar Solutions <br><span class=\"gradient-text\">Your Bright and Affordable Future</span>",
            "hero-desc": "Say goodbye to heavy electricity bills forever. We provide state-of-the-art and complete solar solutions for your home, office, and factory.",
            "btn-quote": "Get a Free Quote",
            "btn-calc": "Calculate Savings",
            "badge-tier-title": "Top Tier Quality",
            "badge-tier-desc": "Tier-1 Solar Panels",
            
            // About
            "about-title": "Who We Are",
            "about-desc": "HAR Solar Solutions is a trusted and certified solar installation company. Our goal is to promote clean, affordable, and eco-friendly energy across Pakistan. Our team of experts ensures premium design, quality, and service so that your solar system performs at its best for decades.",
            "stat-warranty": "Years Warranty",
            "stat-clients": "Happy Clients",
            "stat-power": "Installed Power",
            
            // Services
            "services-title": "Our Services",
            "services-subtitle": "We offer the best and most advanced solar systems tailored to your requirements",
            "service-res-title": "Residential Solar Systems",
            "service-res-desc": "Fully customized solar panel systems for your home, perfectly meeting all your electricity needs.",
            "service-com-title": "Commercial Solar Systems",
            "service-com-desc": "Heavy-duty solar solutions for businesses and factories to significantly reduce your production costs.",
            "service-maint-title": "Maintenance & Support",
            "service-maint-desc": "Dedicated after-sales support, panel cleaning, repairs, and system optimization services.",
            "learn-more": "Learn More",
            
            // Calculator
            "calc-title": "Solar Savings Calculator",
            "calc-subtitle": "Instantly estimate your solar system size and expected savings based on your monthly bill",
            "calc-label-bill": "Enter your average monthly electricity bill (PKR):",
            "calc-label-slider": "Adjust bill amount:",
            "calc-info-note": "Estimates are based on an average rate of 50 PKR per unit and annual average solar performance, including NEPRA Net Metering benefits.",
            "calc-out-size": "System Size",
            "calc-out-monthly": "Monthly Savings",
            "calc-out-payback": "Payback Period",
            "calc-out-lifetime": "25-Year Savings",
            "calc-years": "Years",
            
            // Why Us
            "why-title": "Why Choose Us?",
            "why-subtitle": "We never compromise on quality, reliability, and excellent services",
            "why-r1-title": "Premium Quality Equipment",
            "why-r1-desc": "We exclusively use Tier-1 international brand solar panels and inverters.",
            "why-r2-title": "Professional Installation",
            "why-r2-desc": "Our engineering team completes every project with expert technical precision and safety.",
            "why-r3-title": "Top-tier Warranty",
            "why-r3-desc": "Enjoy long-term performance warranties on solar panels and inverters.",
            
            // Contact
            "contact-title": "Get a Free Quote",
            "contact-subtitle": "Contact us today for your solar system and break free from heavy electricity bills!",
            "c-phone": "Phone Number",
            "c-email": "Email Address",
            "c-address": "Office Address",
            "c-address-val": "Gulberg III, Lahore, Pakistan",
            "f-name": "Your Name",
            "f-phone": "Phone Number",
            "f-email": "Email Address",
            "f-type": "System Type",
            "opt-res": "Residential Solar System",
            "opt-com": "Commercial Solar System",
            "opt-maint": "Maintenance & Service",
            "f-msg": "Additional Details or Message",
            "f-btn-submit": "Submit Request",
            "success-title": "Thank You!",
            "success-msg": "Your request has been successfully submitted. Our solar consultant will contact you shortly.",
            "btn-close": "Close",
            
            // Footer
            "footer-desc": "Your trusted and certified partner for savings on electricity bills and a brighter Pakistan.",
            "foot-links-title": "Quick Links",
            "foot-services-title": "Our Services",
            "footer-copy": "All rights reserved."
        }
    };

    let currentLang = 'ur'; // Default Language

    const langToggleBtn = document.getElementById('lang-toggle');
    const langText = document.getElementById('lang-text');

    function updateLanguage(lang) {
        currentLang = lang;
        const html = document.documentElement;
        
        // 1. Set language direction and attributes
        if (lang === 'ur') {
            html.setAttribute('lang', 'ur');
            html.setAttribute('dir', 'rtl');
            langText.textContent = 'English';
        } else {
            html.setAttribute('lang', 'en');
            html.setAttribute('dir', 'ltr');
            langText.textContent = 'اردو';
        }

        // 2. Loop and replace element content
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            if (translations[lang] && translations[lang][key]) {
                const text = translations[lang][key];
                
                // Handle form input placeholders & labels
                if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                    // Handled separately if label exists
                } else if (element.tagName === 'SELECT') {
                    // Handled via inner option tags
                } else {
                    // Render HTML markup (for titles with gradients)
                    element.innerHTML = text;
                }
            }
        });

        // 3. Update select options translations manually to preserve select functionality
        const select = document.getElementById('form-type');
        if (select) {
            select.options[0].text = translations[lang]['opt-res'];
            select.options[1].text = translations[lang]['opt-com'];
            select.options[2].text = translations[lang]['opt-maint'];
        }

        // 4. Update calculator labels and recalculate results
        updateCalculator();
    }

    // Toggle button listener
    if (langToggleBtn) {
        langToggleBtn.addEventListener('click', () => {
            const nextLang = currentLang === 'ur' ? 'en' : 'ur';
            updateLanguage(nextLang);
        });
    }

    // 2. Interactive Solar Savings Calculator
    const billInput = document.getElementById('bill-input');
    const billSlider = document.getElementById('bill-slider');
    const sliderVal = document.getElementById('slider-val');
    
    const outSize = document.getElementById('out-size');
    const outMonthly = document.getElementById('out-monthly');
    const outPayback = document.getElementById('out-payback');
    const outLifetime = document.getElementById('out-lifetime');

    function updateCalculator() {
        let billValue = parseFloat(billInput.value);
        if (isNaN(billValue) || billValue < 0) {
            billValue = 0;
        }

        // Sync slider
        if (billValue <= parseFloat(billSlider.max)) {
            billSlider.value = billValue;
        }
        sliderVal.textContent = billValue.toLocaleString() + ' PKR';

        // Calculator Formula Details:
        // Average unit price in Pakistan = ~50 PKR. Units = Bill / 50.
        // Solar panels yield: 1kW system produces roughly 120 units per month.
        // System size in kW = Units / 120 = (Bill / 50) / 120 = Bill / 6000.
        let systemSize = billValue / 6000;
        
        // Clamp system size to minimum 1.5 kW and round off nicely
        if (systemSize < 1.5 && billValue > 0) {
            systemSize = 1.5;
        }
        systemSize = Math.round(systemSize * 10) / 10; // round to 1 decimal place

        // Monthly Savings: Solar offsets approx 90% of electricity bill
        let monthlySavings = billValue * 0.90;
        
        // Total system cost estimation:
        // ~150,000 PKR per kW + 80,000 PKR fixed overhead (Structure, Net metering licensing, cable etc.)
        let systemCost = (systemSize * 150000) + 80000;
        
        // Payback period in years
        let paybackPeriod = 0;
        if (monthlySavings > 0) {
            paybackPeriod = systemCost / (monthlySavings * 12);
        }
        paybackPeriod = Math.round(paybackPeriod * 10) / 10; // round to 1 decimal place
        if (paybackPeriod < 2.2) paybackPeriod = 2.2; // clamp to standard hardware lifetime return

        // 25 Years Lifetime Savings
        let lifetimeSavings = monthlySavings * 12 * 25;

        // Render Values
        if (billValue === 0) {
            outSize.textContent = "0.0";
            outMonthly.textContent = "0";
            outPayback.textContent = "0.0";
            outLifetime.textContent = "0";
        } else {
            outSize.textContent = systemSize.toFixed(1);
            outMonthly.textContent = Math.round(monthlySavings).toLocaleString();
            outPayback.textContent = paybackPeriod.toFixed(1);
            
            // Format Lifetime Savings elegantly (M for English, Million/Lakh formatting etc.)
            if (lifetimeSavings >= 1000000) {
                let millions = lifetimeSavings / 1000000;
                let suffix = currentLang === 'ur' ? ' ملین' : 'M';
                outLifetime.textContent = millions.toFixed(1) + suffix;
            } else {
                outLifetime.textContent = Math.round(lifetimeSavings).toLocaleString();
            }
        }
    }

    if (billInput && billSlider) {
        billInput.addEventListener('input', () => {
            if (billInput.value > 200000) {
                billSlider.max = billInput.value;
            }
            updateCalculator();
        });

        billSlider.addEventListener('input', () => {
            billInput.value = billSlider.value;
            updateCalculator();
        });
    }

    // 3. Interactive Mouse-Tilt 3D Card Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
            const cardWidth = cardRect.width;
            const cardHeight = cardRect.height;
            
            // Mouse coordinates relative to card center
            const mouseX = e.clientX - cardRect.left - cardWidth / 2;
            const mouseY = e.clientY - cardRect.top - cardHeight / 2;
            
            // Map movement to degrees (maximum tilt of 10 degrees)
            const rotateX = -(mouseY / cardHeight) * 15;
            const rotateY = (mouseX / cardWidth) * 15;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            card.style.boxShadow = `0 15px 35px rgba(0, 245, 255, 0.15), 0 5px 15px rgba(0, 0, 0, 0.5)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            card.style.boxShadow = '0 8px 32px 0 rgba(0, 0, 0, 0.3)';
        });
    });

    // 4. Glowing Custom Cursor follow
    const cursorGlow = document.getElementById('cursor-glow');
    document.addEventListener('mousemove', (e) => {
        if (cursorGlow) {
            cursorGlow.style.left = e.clientX + 'px';
            cursorGlow.style.top = e.clientY + 'px';
        }
    });

    // 5. Canvas Solar Particle Animation Background
    const canvas = document.getElementById('solar-particles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 120 };

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.x;
            mouse.y = e.y;
        });

        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Resize Canvas to fit screen
        function initCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            createParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height + canvas.height; // Start below screen or random height
                this.size = Math.random() * 3 + 1;
                
                // Slowly float upwards
                this.speedX = Math.random() * 0.4 - 0.2;
                this.speedY = -(Math.random() * 0.8 + 0.3);
                
                // Color variation (glowing yellow/gold or bright cyan)
                this.colorVal = Math.random();
                this.alpha = Math.random() * 0.5 + 0.2;
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                
                if (this.colorVal > 0.4) {
                    ctx.fillStyle = '#f59e0b'; // Gold
                    ctx.shadowBlur = this.size * 3;
                    ctx.shadowColor = '#f59e0b';
                } else {
                    ctx.fillStyle = '#06b6d4'; // Cyan
                    ctx.shadowBlur = this.size * 3;
                    ctx.shadowColor = '#06b6d4';
                }
                
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                // Loop particle back to bottom if it floats off top
                if (this.y < -10) {
                    this.y = canvas.height + 10;
                    this.x = Math.random() * canvas.width;
                    this.alpha = Math.random() * 0.5 + 0.2;
                }

                // Push particles slightly when mouse gets close (Solar wind effect)
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = this.x - mouse.x;
                    let dy = this.y - mouse.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        
                        this.x += directionX * force * 3;
                        this.y += directionY * force * 3;
                    }
                }

                this.draw();
            }
        }

        function createParticles() {
            particles = [];
            // Generate density based on screen resolution
            const density = Math.floor((canvas.width * canvas.height) / 9000);
            const maxParticles = Math.min(density, 120);
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
                // Spread initially across canvas height
                particles[i].y = Math.random() * canvas.height;
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            // Draw radial glow center in background
            let gradient = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 100, canvas.width / 2, canvas.height / 2, canvas.width);
            gradient.addColorStop(0, '#0a1024');
            gradient.addColorStop(0.5, '#070a13');
            gradient.addColorStop(1, '#03050a');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
            }
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', initCanvas);
        initCanvas();
        animate();
    }

    // 6. Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - varNavbarHeightOffset())) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    function varNavbarHeightOffset() {
        return window.innerWidth <= 768 ? 75 : 85;
    }

    // 7. Mobile Navigation Toggle Menu
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('open');
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('open')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            } else {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu on navigation link click
        document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            });
        });

        // Close menu on clicking outside
        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                navMenu.classList.remove('open');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
        });
    }

    // 8. Contact Form Handling with Feedback Overlay
    const quoteForm = document.getElementById('quote-form');
    const formSuccess = document.getElementById('form-success');
    const successClose = document.getElementById('success-close');

    if (quoteForm && formSuccess) {
        quoteForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract values
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const type = document.getElementById('form-type').value;
            const message = document.getElementById('form-message').value;

            // Submit Button loading state
            const submitBtn = document.getElementById('btn-submit-form');
            const submitBtnText = document.getElementById('btn-submit-text');
            const originalText = submitBtnText.textContent;
            
            submitBtn.disabled = true;
            submitBtnText.textContent = currentLang === 'ur' ? 'جمع کیا جا رہا ہے...' : 'Submitting...';
            
            // Simulate API Submission Delay
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtnText.textContent = originalText;
                
                // Show success container overlay
                formSuccess.classList.remove('hide');
                quoteForm.reset();
            }, 1500);
        });
    }

    if (successClose && formSuccess) {
        successClose.addEventListener('click', () => {
            formSuccess.classList.add('hide');
        });
    }

    // 9. Initial setup execution
    updateCalculator();
});
