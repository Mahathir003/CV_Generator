// Global application state variables
      let currentZoom = 0.6;
      let currentPurpose = "professional"; // 'professional' (CV mode) or 'marital' (Biodata mode)
      let currentTemplateId = "4"; // Template 4 is active by default on launch

      // =========================================================================
      // [INITIAL MOCK DATA REGISTRIES]
      // =========================================================================
      let experiences = [
        {
          role: "SENIOR GRAPHIC DESIGNER",
          company: "Creative Lab",
          date: "(2020 - 2030)",
          desc: "• Create compelling visual concepts for diverse digital marketing campaigns.\n• Develop and maintain a consistent brand identity across all platforms.",
        },
        {
          role: "SENIOR GRAPHIC DESIGNER",
          company: "Studio North",
          date: "(2017 - 2019)",
          desc: "• Prepare final layout designs for both print and digital publication.\n• Design engaging graphics for social media and website interfaces.",
        }
      ];

      let educations = [
        {
          degree: "Bachelor of Design\n3.65 GPA",
          inst: "NORTH COLLEGE",
          date: "(2011 - 2015)",
        },
        {
          degree: "Bachelor of Design\n3.74 GPA",
          inst: "WEST UNIVERSITY",
          date: "(2014 - 2019)",
        }
      ];

      let skills = [
        { name: "Web Design", level: 90 },
        { name: "Branding", level: 85 },
        { name: "Graphic Design", level: 95 },
        { name: "SEO", level: 75 },
        { name: "Marketing", level: 80 }
      ];

      let languages = [
        "English",
        "French"
      ];

      let references = [
        { name: "Estelle Darcy", relation: "Wardiere Inc. / CEO", contact: "P: +123-456-7890 | E: hello@reallygreatsite.com" },
        { name: "Harper Russo", relation: "Wardiere Inc. / CEO", contact: "P: +123-456-7890 | E: hello@reallygreatsite.com" }
      ];

      let relatives = [
        { name: "Dr. Anand Fletcher", relation: "Father", designation: "Chief Medical Director" },
        { name: "Mrs. Clara Fletcher", relation: "Mother", designation: "High School Principal" },
        { name: "Suresh Fletcher", relation: "Elder Brother", designation: "Senior Architect at TechCorp" }
      ];

      // =========================================================================
      // [CONTRAST CALCULATION & LUMINANCE ALGORITHMS]
      // =========================================================================
      
      // Computes hex-contrast properties to determine if light or dark layout is needed
      function getContrastColor(hexColor) {
        if (!hexColor) return '#1e293b';
        let hex = hexColor.replace('#', '');
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) return '#1e293b';
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 140) ? '#1e293b' : '#ffffff';
      }

      // Safeguards color saturation output on light-panel layouts (Forces dark readable color variant)
      function getReadableColorOnLight(hexColor) {
        if (!hexColor) return '#1e293b';
        let hex = hexColor.replace('#', '');
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) return '#1e293b';
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        if (yiq > 120) {
          const dr = Math.floor(r * 0.35);
          const dg = Math.floor(g * 0.35);
          const db = Math.floor(b * 0.35);
          return `rgb(${dr}, ${dg}, ${db})`;
        }
        return hexColor;
      }

      // Safeguards color saturation output on dark-panel layouts (Forces light readable color variant)
      function getReadableColorOnDark(hexColor) {
        if (!hexColor) return '#ffffff';
        let hex = hexColor.replace('#', '');
        if (hex.length === 3) {
          hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        if (hex.length !== 6) return '#ffffff';
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        if (yiq < 130) {
          const lr = Math.min(255, Math.floor(r + (255 - r) * 0.65));
          const lg = Math.min(255, Math.floor(g + (255 - g) * 0.65));
          const lb = Math.min(255, Math.floor(b + (255 - b) * 0.65));
          return `rgb(${lr}, ${lg}, ${lb})`;
        }
        return hexColor;
      }

      // =========================================================================
      // [DYNAMIC SECTION HEADER & TIMELINE MARKUP BUILDERS]
      // =========================================================================
      
      // Builds a ribbon vector chevron header for category blocks
      function getRibbonHeaderHtml(title, primaryBg, secondaryColor) {
        const textContrast = getContrastColor(secondaryColor);
        return `
          <div style="display: block; margin-bottom: 8px; margin-top: 10px;">
            <div style="display: block; height: 24px; font-size: 0; white-space: nowrap;">
              <div style="display: inline-block; background-color: ${secondaryColor}; height: 24px; line-height: 24px; padding: 0 14px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: ${textContrast}; vertical-align: top; box-sizing: border-box; border-radius: 4px 0 0 4px;">
                ${title}
              </div>
              <div style="display: inline-block; vertical-align: top; width: 8px; height: 24px; box-sizing: border-box;">
                <svg width="8" height="24" viewBox="0 0 8 24" preserveAspectRatio="none" style="display: block; width: 100%; height: 100%;">
                  <path d="M0 0 L0 24 L8 12 Z" fill="${secondaryColor}" />
                </svg>
              </div>
            </div>
          </div>
        `;
      }

      // Builds bullet timeline rows for light backgrounds
      function getTimelineEntryHtml(title, subtitle, timeline, desc, dotColor) {
        const safeDotColor = getReadableColorOnLight(dotColor);
        return `
          <div style="display: block; margin-bottom: 8px;">
            <div style="font-size: 0; display: block; line-height: 1; margin-bottom: 3px;">
              <div style="display: inline-block; width: 70%; font-size: 12.5px; font-weight: 700; color: #1e293b; vertical-align: top; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${safeDotColor}; margin-right: 8px; vertical-align: middle; transform: translateY(-1px);"></span>
                <span style="vertical-align: middle;">${title}</span>
              </div>
              <div style="display: inline-block; width: 30%; font-size: 11.5px; font-weight: 700; color: ${safeDotColor}; text-align: right; vertical-align: top;">
                ${timeline}
              </div>
            </div>
            <div style="display: block; padding-left: 14px;">
              <div style="font-size: 11.5px; font-weight: 600; color: #475569; margin-bottom: 2px;">${subtitle}</div>
              ${desc ? `<p style="font-size: 11px; color: #475569; line-height: 1.4 !important; margin: 0; text-align: justify; white-space: pre-line;">${desc}</p>` : ""}
            </div>
          </div>
        `;
      }

      // Builds bullet timeline rows for dark backgrounds
      function getTimelineEntryDarkHtml(title, subtitle, timeline, desc, dotColor) {
        const safeDotColor = getReadableColorOnDark(dotColor);
        return `
          <div style="display: block; margin-bottom: 8px;">
            <div style="font-size: 0; display: block; line-height: 1; margin-bottom: 3px;">
              <div style="display: inline-block; width: 70%; font-size: 12.5px; font-weight: 700; color: #ffffff; vertical-align: top; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${safeDotColor}; margin-right: 8px; vertical-align: middle; transform: translateY(-1px);"></span>
                <span style="vertical-align: middle;">${title}</span>
              </div>
              <div style="display: inline-block; width: 30%; font-size: 11.5px; font-weight: 700; color: ${safeDotColor}; text-align: right; vertical-align: top;">
                ${timeline}
              </div>
            </div>
            <div style="display: block; padding-left: 14px;">
              <div style="font-size: 11.5px; font-weight: 600; color: #cbd5e1; margin-bottom: 2px;">${subtitle}</div>
              ${desc ? `<p style="font-size: 11px; color: #cbd5e1; line-height: 1.4 !important; margin: 0; text-align: justify; white-space: pre-line;">${desc}</p>` : ""}
            </div>
          </div>
        `;
      }

      // =========================================================================
      // [LIST DATA COMPILING & INTERACTIVE RENDERERS]
      // =========================================================================

      // Handles the live base64 upload and previewing of local image files
      function handleImageUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
          showToast("Please choose an image under 5MB.");
          return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
          const base64Data = e.target.result;
          document.getElementById("input-photo").value = base64Data;
          renderLivePreview();
          showToast("Photo uploaded successfully!");
        };
        reader.readAsDataURL(file);
      }

      // Renders text elements dynamically when a different font is selected
      function updateFont() {
        const font = document.getElementById("fontSelector").value;
        let fontStack = "";
        if (font === "Calibri") fontStack = 'Calibri, Candara, Segoe, "Segoe UI", Optima, Arial, sans-serif';
        else if (font === "Arial") fontStack = 'Arial, "Helvetica Neue", Helvetica, sans-serif';
        else if (font === "Helvetica") fontStack = '"Helvetica Neue", Helvetica, Arial, sans-serif';
        else if (font === "Garamond") fontStack = 'Garamond, Baskerville, "Baskerville Old Face", "Hoefler Text", "Times New Roman", serif';
        else if (font === "Cambria") fontStack = 'Cambria, Georgia, serif';
        
        document.documentElement.style.setProperty('--active-font', fontStack);
        renderLivePreview();
      }

      // Switches configurations between CV Mode and Marriage Biodata Mode
      function switchPurpose(purpose) {
        currentPurpose = purpose;
        document.getElementById("purpose-prof").className =
          "py-1.5 px-3 rounded-md text-xs font-semibold text-slate-400";
        document.getElementById("purpose-marital").className =
          "py-1.5 px-3 rounded-md text-xs font-semibold text-slate-400";

        if (purpose === "professional") {
          document.getElementById("purpose-prof").className =
            "py-1.5 px-3 rounded-md text-xs font-semibold bg-sky-600 text-white shadow";
          document.getElementById("form-prof-fields").classList.remove("hidden");
          document.getElementById("form-marital-fields").classList.add("hidden");
          document.getElementById("primaryColor").value = "#0b192c";
          document.getElementById("secondaryColor").value = "#eab308";
          document.getElementById("f-name").value = "Adam Fletcher";
          document.getElementById("f-subtitle").value = "Graphics Designer";
        } else {
          document.getElementById("purpose-marital").className =
            "py-1.5 px-3 rounded-md text-xs font-semibold bg-sky-600 text-white shadow";
          document.getElementById("form-prof-fields").classList.add("hidden");
          document.getElementById("form-marital-fields").classList.remove("hidden");
          document.getElementById("primaryColor").value = "#6b152b";
          document.getElementById("secondaryColor").value = "#d4af37";
          document.getElementById("f-name").value = "Adam Sharma";
          document.getElementById("f-subtitle").value = "Brahmin / Vashishta";
        }
        updateColors();
      }

      // Family/Relative items configuration controls
      function renderRelativesInputs() {
        const container = document.getElementById("marital-relatives-container");
        container.innerHTML = "";
        relatives.forEach((rel, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${rel.name}</strong> (${rel.relation})</div>
              <button onclick="removeRelative(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addRelative() {
        if (relatives.length >= 6) {
          showToast("Maximum of 6 family members recorded.");
          return;
        }
        const name = document.getElementById("rel-name").value.trim();
        const relation = document.getElementById("rel-relation").value.trim();
        const designation = document.getElementById("rel-designation").value.trim();

        if (!name || !relation) return;

        relatives.push({ name, relation, designation });
        document.getElementById("rel-name").value = "";
        document.getElementById("rel-relation").value = "";
        document.getElementById("rel-designation").value = "";

        renderRelativesInputs();
        renderLivePreview();
      }

      function removeRelative(idx) {
        relatives.splice(idx, 1);
        renderRelativesInputs();
        renderLivePreview();
      }

      // Experience timeline input controls
      function renderCvExperienceInputs() {
        const container = document.getElementById("cv-experience-container");
        container.innerHTML = "";
        experiences.forEach((exp, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${exp.role}</strong> (${exp.company})</div>
              <button onclick="removeExperience(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addExperience() {
        if (experiences.length >= 3) {
          showToast("Maximum 3 jobs recorded.");
          return;
        }
        const role = document.getElementById("exp-role").value;
        const company = document.getElementById("exp-comp").value;
        const date = document.getElementById("exp-date").value;
        const desc = document.getElementById("exp-desc").value;

        if (!role || !company) return;
        experiences.push({ role, company, date, desc });
        document.getElementById("exp-role").value = "";
        document.getElementById("exp-comp").value = "";
        document.getElementById("exp-date").value = "";
        document.getElementById("exp-desc").value = "";

        renderCvExperienceInputs();
        renderLivePreview();
      }

      function removeExperience(idx) {
        experiences.splice(idx, 1);
        renderCvExperienceInputs();
        renderLivePreview();
      }

      // Academic Records input controls
      function renderCvEducationInputs() {
        const container = document.getElementById("cv-education-container");
        container.innerHTML = "";
        educations.forEach((edu, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${edu.degree}</strong></div>
              <button onclick="removeEducation(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addEducation() {
        if (educations.length >= 3) {
          showToast("Maximum 3 degrees recorded.");
          return;
        }
        const degree = document.getElementById("edu-degree").value;
        const inst = document.getElementById("edu-inst").value;
        const date = document.getElementById("edu-date").value;

        if (!degree || !inst) return;
        educations.push({ degree, inst, date });
        document.getElementById("edu-degree").value = "";
        document.getElementById("edu-inst").value = "";
        document.getElementById("edu-date").value = "";

        renderCvEducationInputs();
        renderLivePreview();
      }

      function removeEducation(idx) {
        educations.splice(idx, 1);
        renderCvEducationInputs();
        renderLivePreview();
      }

      // Skills Matrix input controls
      function renderCvSkillInputs() {
        const container = document.getElementById("cv-skills-container");
        container.innerHTML = "";
        skills.forEach((skill, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${skill.name}</strong> (${skill.level}%)</div>
              <button onclick="removeSkill(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addSkill() {
        if (skills.length >= 6) {
          showToast("Maximum 6 skills recorded.");
          return;
        }
        const name = document.getElementById("skill-name").value;
        let level = parseInt(document.getElementById("skill-val").value || "80");
        if (!name) return;
        if (level > 100) level = 100;
        if (level < 0) level = 0;

        skills.push({ name, level });
        document.getElementById("skill-name").value = "";
        document.getElementById("skill-val").value = "";

        renderCvSkillInputs();
        renderLivePreview();
      }

      // Language Registry input controls
      function removeSkill(idx) {
        skills.splice(idx, 1);
        renderCvSkillInputs();
        renderLivePreview();
      }

      function renderCvLanguageInputs() {
        const container = document.getElementById("cv-languages-container");
        container.innerHTML = "";
        languages.forEach((lang, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${lang}</strong></div>
              <button onclick="removeLanguage(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addLanguage() {
        if (languages.length >= 4) {
          showToast("Maximum 4 languages recorded.");
          return;
        }
        const name = document.getElementById("lang-name").value;
        if (!name) return;

        languages.push(name);
        document.getElementById("lang-name").value = "";

        renderCvLanguageInputs();
        renderLivePreview();
      }

      function removeLanguage(idx) {
        languages.splice(idx, 1);
        renderCvLanguageInputs();
        renderLivePreview();
      }

      // Reference Cards input controls
      function renderCvReferencesInputs() {
        const container = document.getElementById("cv-references-container");
        container.innerHTML = "";
        references.forEach((ref, idx) => {
          container.innerHTML += `
            <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs">
              <div class="truncate"><strong>${ref.name}</strong> (${ref.relation})</div>
              <button onclick="removeReference(${idx})" class="text-rose-500 hover:text-rose-400 font-bold p-1 cursor-pointer"><i class="fa-solid fa-trash"></i></button>
            </div>
          `;
        });
      }

      function addReference() {
        if (references.length >= 2) {
          showToast("Maximum 2 references allowed to fit perfectly.");
          return;
        }
        const name = document.getElementById("ref-name").value.trim();
        const relation = document.getElementById("ref-relation").value.trim();
        const contact = document.getElementById("ref-contact").value.trim();

        if (!name || !relation) return;
        references.push({ name, relation, contact });
        document.getElementById("ref-name").value = "";
        document.getElementById("ref-relation").value = "";
        document.getElementById("ref-contact").value = "";

        renderCvReferencesInputs();
        renderLivePreview();
      }

      function removeReference(idx) {
        references.splice(idx, 1);
        renderCvReferencesInputs();
        renderLivePreview();
      }

      // Zoom factor calculation mapping
      function zoomCanvas(delta) {
        currentZoom = Math.max(0.3, Math.min(1.2, currentZoom + delta));
        applyZoom();
      }

      function resetZoom() {
        currentZoom = 0.6;
        applyZoom();
      }

      function applyZoom() {
        document.getElementById("canvasTarget").style.transform = `scale(${currentZoom})`;
        document.getElementById("zoomDisplay").innerText = `Zoom: ${Math.round(currentZoom * 100)}%`;
      }

      function updateColors() {
        renderLivePreview();
      }

      function selectTemplate(id) {
        currentTemplateId = id;
        const cards = document.querySelectorAll(".template-card-btn");
        cards.forEach((card) => card.classList.remove("active"));
        const selectedCard = document.getElementById(`tplBtn-${id}`);
        if (selectedCard) selectedCard.classList.add("active");
        renderLivePreview();
      }

      // Inline SVG Vector catalog retriever
      function getVectorIcon(type, strokeColor = "#ffffff") {
        const icons = {
          phone: `<svg width="12" height="12" fill="none" stroke="${strokeColor}" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
          mail: `<svg width="12" height="12" fill="none" stroke="${strokeColor}" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
          map: `<svg width="12" height="12" fill="none" stroke="${strokeColor}" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
          web: `<svg width="12" height="12" fill="none" stroke="${strokeColor}" stroke-width="2.5" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:middle;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
        };
        return icons[type] || "";
      }

      // =========================================================================
      // [THE LIVE COMPILING VISUAL RENDERING ENGINE]
      // =========================================================================
      function renderLivePreview() {
        const canvas = document.getElementById("canvasTarget");
        const priColor = document.getElementById("primaryColor").value;
        const secColor = document.getElementById("secondaryColor").value;
        const font = document.getElementById("fontSelector").value;

        // Automatically determine if white or dark slate text contrasts best
        const isPriDark = getContrastColor(priColor) === '#ffffff';
        const isSecDark = getContrastColor(secColor) === '#ffffff';

        // Calculate contrast-checked versions of colors based on background
        const priOnLight = getReadableColorOnLight(priColor);
        const secOnLight = getReadableColorOnLight(secColor);
        const priOnDark = getReadableColorOnDark(priColor);
        const secOnDark = getReadableColorOnDark(secColor);

        const secOnPri = isPriDark ? getReadableColorOnDark(secColor) : getReadableColorOnLight(secColor);
        const priOnSec = isSecDark ? getReadableColorOnDark(priColor) : getReadableColorOnLight(priColor);

        // Fetch values from input elements
        const name = document.getElementById("f-name").value || "YOUR NAME";
        const subtitle = document.getElementById("f-subtitle").value || "YOUR TITLE";
        const about = document.getElementById("f-about").value || "Bio summary";
        const phone = document.getElementById("f-phone").value || "No phone";
        const email = document.getElementById("f-email").value || "No email";
        const location = document.getElementById("f-loc").value || "No location";
        const web = document.getElementById("f-web").value || "No website";
        const photoUrl = document.getElementById("input-photo").value;

        // Fetch values from matrimonial-only inputs
        const religion = document.getElementById("b-religion") ? document.getElementById("b-religion").value : "Hindu / Brahmin";
        const gothra = document.getElementById("b-gothra") ? document.getElementById("b-gothra").value : "Vashishta";
        const horo = document.getElementById("b-horo") ? document.getElementById("b-horo").value : "Aries / Ashwini";
        const height = document.getElementById("b-height") ? document.getElementById("b-height").value : "5 Feet 11 Inches";
        const dob = document.getElementById("b-dob") ? document.getElementById("b-dob").value : "12th April 1996";
        const pob = document.getElementById("b-pob") ? document.getElementById("b-pob").value : "New Delhi, India";
        const expectations = document.getElementById("b-expect") ? document.getElementById("b-expect").value : "Seeking compatibility and mutual values...";

        // Split name into first and remaining parts for creative typography layouts
        const nameParts = name.split(" ");
        const firstName = nameParts[0] || "";
        const restOfName = nameParts.slice(1).join(" ") || "";

        canvas.innerHTML = "";

        const primaryContrast = getContrastColor(priColor);
        const secondaryContrast = getContrastColor(secColor);

        // =========================================================================
        // [SHARED REUSABLE INFOGRAPHIC MODULES]
        // =========================================================================
        
        // Progress bars inside dark sidebars (Template 1, etc.)
        const skillsSectionHtml = `
          <div style="margin-top:12px; margin-bottom:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnPri}; tracking:1px; margin-bottom:6px;">Core Skills</h3>
            <div style="display:block;">
              ${skills.map(skill => `
                <div style="display:block; margin-bottom:4px;">
                  <div style="font-size:11.5px; font-weight:600; color:${primaryContrast}; display:flex; justify-content:space-between; line-height:1.2; opacity:0.95;">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                  </div>
                  <div class="bar-container" style="background:rgba(255,255,255,0.15); height:4px; margin-top:2px;">
                    <div class="bar-fill" style="width:${skill.level}%; background-color:${secOnPri}; height:100%;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // Progress bars inside light sidebars (Template 2, 5, etc.)
        const skillsOnLightHtml = `
          <div style="margin-top:12px; margin-bottom:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnLight}; tracking:1px; margin-bottom:6px;">Core Skills</h3>
            <div style="display:block;">
              ${skills.map(skill => `
                <div style="display:block; margin-bottom:4px;">
                  <div style="font-size:11.5px; font-weight:600; color:#475569; display:flex; justify-content:space-between; line-height:1.2;">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                  </div>
                  <div class="bar-container" style="background:rgba(15, 23, 42, 0.08); height:4px; margin-top:2px;">
                    <div class="bar-fill" style="width:${skill.level}%; background-color:${secOnLight}; height:100%;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // Progress bars inside dark sidebars (Template 6, 9, etc.)
        const skillsOnDarkHtml = `
          <div style="margin-top:12px; margin-bottom:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnDark}; tracking:1px; margin-bottom:6px;">Core Skills</h3>
            <div style="display:block;">
              ${skills.map(skill => `
                <div style="display:block; margin-bottom:4px;">
                  <div style="font-size:11.5px; font-weight:600; color:#cbd5e1; display:flex; justify-content:space-between; line-height:1.2;">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                  </div>
                  <div class="bar-container" style="background:rgba(255, 255, 255, 0.1); height:4px; margin-top:2px;">
                    <div class="bar-fill" style="width:${skill.level}%; background-color:${secOnDark}; height:100%;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // Progress bars inside secondary background elements (Template 10 sidebar, etc.)
        const skillsSecBgHtml = `
          <div style="margin-top:12px; margin-bottom:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${priOnSec}; tracking:1px; margin-bottom:6px;">Core Skills</h3>
            <div style="display:block;">
              ${skills.map(skill => `
                <div style="display:block; margin-bottom:4px;">
                  <div style="font-size:11.5px; font-weight:600; color:${secondaryContrast}; display:flex; justify-content:space-between; line-height:1.2; opacity:0.95;">
                    <span>${skill.name}</span>
                    <span>${skill.level}%</span>
                  </div>
                  <div class="bar-container" style="background:rgba(${secondaryContrast === '#ffffff' ? '255,255,255' : '15,23,42'},0.15); height:4px; margin-top:2px;">
                    <div class="bar-fill" style="width:${skill.level}%; background-color:${priOnSec}; height:100%;"></div>
                  </div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // Languages inside dark sidebars (Template 1, etc.)
        const languagesSectionHtml = `
          <div style="margin-top:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnPri}; tracking:1px; margin-bottom:5px;">Languages</h3>
            <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; line-height:1.4;">
              ${languages.map(lang => `<div style="margin-bottom:2px;">• ${lang}</div>`).join("")}
            </div>
          </div>
        `;

        // Languages inside light sidebars (Template 2, 5, etc.)
        const languagesOnLightHtml = `
          <div style="margin-top:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnLight}; tracking:1px; margin-bottom:5px;">Languages</h3>
            <div style="font-size:11.5px; color:#475569; line-height:1.4;">
              ${languages.map(lang => `<div style="margin-bottom:2px;">• ${lang}</div>`).join("")}
            </div>
          </div>
        `;

        // Languages inside dark sidebars (Template 6, 9, etc.)
        const languagesOnDarkHtml = `
          <div style="margin-top:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnDark}; tracking:1px; margin-bottom:5px;">Languages</h3>
            <div style="font-size:11.5px; color:#cbd5e1; line-height:1.4;">
              ${languages.map(lang => `<div style="margin-bottom:2px;">• ${lang}</div>`).join("")}
            </div>
          </div>
        `;

        // Languages inside secondary background elements (Template 10 sidebar, etc.)
        const languagesSecBgHtml = `
          <div style="margin-top:10px;">
            <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${priOnSec}; tracking:1px; margin-bottom:5px;">Languages</h3>
            <div style="font-size:11.5px; color:${secondaryContrast}; opacity:0.9; line-height:1.4;">
              ${languages.map(lang => `<div style="margin-bottom:2px;">• ${lang}</div>`).join("")}
            </div>
          </div>
        `;

        // References layout for light-themed documents
        const referencesBlockHtml = `
          <div style="margin-top:12px; border-top:1px solid #cbd5e1; padding-top:10px;">
            <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${priOnLight}; letter-spacing:1px; margin-bottom:8px;">References</h3>
            <div style="display:flex; justify-content:space-between; gap:16px;">
              ${references.map(ref => `
                <div style="width:48%; font-size:11.5px; line-height:1.4;">
                  <div style="font-weight:700; color:#1e293b;">${ref.name}</div>
                  <div style="color:#64748b; font-weight:500;">${ref.relation}</div>
                  <div style="color:#475569; margin-top:2px; font-size:10.5px;">${ref.contact}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // References layout for dark-themed documents
        const referencesDarkBlockHtml = `
          <div style="margin-top:12px; border-top:1px solid #334155; padding-top:10px;">
            <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnDark}; letter-spacing:1px; margin-bottom:8px;">References</h3>
            <div style="display:flex; justify-content:space-between; gap:16px;">
              ${references.map(ref => `
                <div style="width:48%; font-size:11.5px; line-height:1.4;">
                  <div style="font-weight:700; color:#ffffff;">${ref.name}</div>
                  <div style="color:#cbd5e1; font-weight:500;">${ref.relation}</div>
                  <div style="color:#94a3b8; margin-top:2px; font-size:10.5px;">${ref.contact}</div>
                </div>
              `).join("")}
            </div>
          </div>
        `;

        // Family profile grid layout for Marriage Biodata
        const familyListHtml = `
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 6px;">
            ${relatives.map(rel => `
              <div style="padding: 6px 8px; background-color:#f1f5f9; border-left: 3px solid ${secOnLight}; border-radius:4px; font-size:11.5px; line-height:1.35;">
                <div style="font-weight:700; color:#1e293b;">${rel.name}</div>
                <div style="font-weight:600; color:#64748b; font-size:10px; text-transform:uppercase;">${rel.relation}</div>
                <div style="color:#475569; font-size:10px;">${rel.designation || "N/A"}</div>
              </div>
            `).join("")}
          </div>
        `;

        const familyListDarkHtml = `
          <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-top: 6px;">
            ${relatives.map(rel => `
              <div style="padding: 6px 8px; background-color:#334155; border-left: 3px solid ${secOnDark}; border-radius:4px; font-size:11.5px; line-height:1.35;">
                <div style="font-weight:700; color:#ffffff;">${rel.name}</div>
                <div style="font-weight:600; color:#cbd5e1; font-size:10px; text-transform:uppercase;">${rel.relation}</div>
                <div style="color:#94a3b8; font-size:10px;">${rel.designation || "N/A"}</div>
              </div>
            `).join("")}
          </div>
        `;

        // =========================================================================
        // [SHARED MASTER DATA COMPILE FLOWS (CV VS BIODATA)]
        // =========================================================================
        let customBlockHtml = "";
        let customBlockDarkHtml = "";

        if (currentPurpose === "professional") {
          // Compile CV Mode content blocks
          customBlockHtml = `
            <div>
              ${getRibbonHeaderHtml("Academic History", priColor, secColor)}
              <div style="display:block; padding-top:2px;">
                ${educations.map((edu) => getTimelineEntryHtml(edu.degree, edu.inst, edu.date, "", secColor)).join("")}
              </div>
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Experience", priColor, secColor)}
              <div style="display:block; padding-top:2px;">
                ${experiences.map((exp) => getTimelineEntryHtml(exp.role, exp.company, exp.date, exp.desc, secColor)).join("")}
              </div>
            </div>
            ${referencesBlockHtml}
          `;

          customBlockDarkHtml = `
            <div>
              ${getRibbonHeaderHtml("Academic History", priColor, secColor)}
              <div style="display:block; padding-top:2px;">
                ${educations.map((edu) => getTimelineEntryDarkHtml(edu.degree, edu.inst, edu.date, "", secColor)).join("")}
              </div>
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Experience", priColor, secColor)}
              <div style="display:block; padding-top:2px;">
                ${experiences.map((exp) => getTimelineEntryDarkHtml(exp.role, exp.company, exp.date, exp.desc, secColor)).join("")}
              </div>
            </div>
            ${referencesDarkBlockHtml}
          `;
        } else {
          // Compile Marriage Biodata content blocks
          customBlockHtml = `
            <div>
              ${getRibbonHeaderHtml("Matrimonial Specs", priColor, secColor)}
              <table style="width:100%; border-collapse:collapse; font-size:11.5px; color:#475569; margin-top:4px;">
                <tr><td style="padding:3px 0; font-weight:700; width:35%; color:${priOnLight}; font-size:11.5px;">Belief System:</td><td style="color:#1e293b; font-size:11.5px;">${religion}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${priOnLight}; font-size:11.5px;">Gothra/Clan:</td><td style="color:#1e293b; font-size:11.5px;">${gothra}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${priOnLight}; font-size:11.5px;">Horoscope:</td><td style="color:#1e293b; font-size:11.5px;">${horo}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${priOnLight}; font-size:11.5px;">Height:</td><td style="color:#1e293b; font-size:11.5px;">${height}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${priOnLight}; font-size:11.5px;">Date of Birth:</td><td style="color:#1e293b; font-size:11.5px;">${dob}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${priOnLight}; font-size:11.5px;">Birth Place:</td><td style="color:#1e293b; font-size:11.5px;">${pob}</td></tr>
              </table>
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Family Profile", priColor, secColor)}
              ${familyListHtml}
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Expected Partner", priColor, secColor)}
              <p style="font-size:11.5px; line-height:1.4 !important; color:#475569; text-align:justify; padding-left:12px; font-style:italic; margin:0; border-left: 2.5px solid ${secOnLight};">
                "${expectations}"
              </p>
            </div>
          `;

          customBlockDarkHtml = `
            <div>
              ${getRibbonHeaderHtml("Matrimonial Specs", priColor, secColor)}
              <table style="width:100%; border-collapse:collapse; font-size:11.5px; color:#cbd5e1; margin-top:4px;">
                <tr><td style="padding:3px 0; font-weight:700; width:35%; color:${secOnDark}; font-size:11.5px;">Belief System:</td><td style="color:#ffffff; font-size:11.5px;">${religion}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${secOnDark}; font-size:11.5px;">Gothra/Clan:</td><td style="color:#ffffff; font-size:11.5px;">${gothra}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${secOnDark}; font-size:11.5px;">Horoscope:</td><td style="color:#ffffff; font-size:11.5px;">${horo}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${secOnDark}; font-size:11.5px;">Height:</td><td style="color:#ffffff; font-size:11.5px;">${height}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${secOnDark}; font-size:11.5px;">Date of Birth:</td><td style="color:#ffffff; font-size:11.5px;">${dob}</td></tr>
                <tr><td style="padding:3px 0; font-weight:700; color:${secOnDark}; font-size:11.5px;">Birth Place:</td><td style="color:#ffffff; font-size:11.5px;">${pob}</td></tr>
              </table>
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Family Profile", priColor, secColor)}
              ${familyListDarkHtml}
            </div>
            <div style="margin-top:8px;">
              ${getRibbonHeaderHtml("Expected Partner", priColor, secColor)}
              <p style="font-size:11.5px; line-height:1.4 !important; color:#cbd5e1; text-align:justify; padding-left:12px; font-style:italic; margin:0; border-left: 2.5px solid ${secOnDark};">
                "${expectations}"
              </p>
            </div>
          `;
        }

        // Render profile photo or standard placeholder
        const profilePhotoHtml = photoUrl
          ? `<img src="${photoUrl}" style="width:100%; height:100%; object-fit:cover;" />`
          : `<div style="width:100%; height:100%; background-color:#e2e8f0; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; color:#475569;">PHOTO</div>`;


        // =========================================================================
        // [MASTER REBUILD ENGINE: THE 10 HARD-CALIBRATED TEMPLATE DOM STORES]
        // =========================================================================
        
        if (currentTemplateId === "1") {
          // ---------------------------------------------------------
          // [TEMPLATE 1: NAVY & GOLD CONTRAST]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; height:100%; width:100%; box-sizing:border-box;">
              <div style="width:74mm; height:100%; background-color:${priColor}; color:${primaryContrast}; padding:20px 16px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="width:130px; height:130px; border-radius:50%; border:3px solid ${secOnPri}; overflow:hidden; margin:6px auto 16px auto;">
                    ${profilePhotoHtml}
                  </div>
                  <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnPri}; margin-bottom:10px;">Contact Details</h3>
                  <div style="font-size:11.5px; line-height:1.5; opacity:0.9; color:${primaryContrast};">
                    <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px; text-align:center;">${getVectorIcon("phone", secOnPri)}</span> ${phone}</div>
                    <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px; text-align:center;">${getVectorIcon("mail", secOnPri)}</span> ${email}</div>
                    <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px; text-align:center;">${getVectorIcon("map", secOnPri)}</span> ${location}</div>
                    <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px; text-align:center;">${getVectorIcon("web", secOnPri)}</span> ${web}</div>
                  </div>
                  ${currentPurpose === "professional" ? skillsSectionHtml + languagesSectionHtml : ""}
                </div>
              </div>
              <div style="flex:1; height:100%; background-color:#ffffff; padding:22px 24px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <h1 style="font-size:24px; font-weight:800; color:${priOnLight}; margin:0;">${name}</h1>
                  <h2 style="font-size:12px; font-weight:700; color:#64748b; tracking:1px; margin-top:2px; text-transform:uppercase;">${subtitle}</h2>
                  <p style="font-size:11.5px; color:#475569; line-height:1.4 !important; text-align:justify; margin-top:10px; margin-bottom:12px;">${about}</p>
                  ${customBlockHtml}
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "2") {
          // ---------------------------------------------------------
          // [TEMPLATE 2: CHOCOLATE RIBBON (CAPSULE)]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#fcfbf9; padding:12px; justify-content:space-between;">
              <div style="height:46mm; width:100%; background-color:${priColor}; color:${primaryContrast}; padding:16px 22px; box-sizing:border-box; display:flex; justify-content:space-between; align-items:center; border-radius: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
                <div style="max-width:132mm;">
                  <h1 style="font-size:22px; font-weight:800; color:${primaryContrast}; text-transform:uppercase; tracking:1px; margin:0;">${name}</h1>
                  <h2 style="font-size:12px; font-weight:700; color:${secOnPri}; margin-top:2px; tracking:1px; text-transform:uppercase;">${subtitle}</h2>
                  <p style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; line-height:1.4 !important; margin-top:5px; text-align:justify;">${about}</p>
                </div>
                <div style="width:110px; height:110px; border:3px solid ${secOnPri}; border-radius:12px; overflow:hidden; flex-shrink:0;">
                  ${profilePhotoHtml}
                </div>
              </div>

              <div style="display:flex; flex:1; height:223mm; box-sizing:border-box; margin-top:12px;">
                <div style="width:72mm; height:100%; background-color:#f5f4f0; padding:18px 16px; border-radius: 16px 0 0 16px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <h3 style="font-size:12px; font-weight:700; color:${priOnLight}; text-transform:uppercase; margin-bottom:10px;">Contact Details</h3>
                    <div style="font-size:11.5px; line-height:1.5; color:#44403c;">
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("phone", priOnLight)}</span> ${phone}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("mail", priOnLight)}</span> ${email}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("map", priOnLight)}</span> ${location}</div>
                    </div>
                    ${currentPurpose === "professional" ? skillsOnLightHtml + languagesOnLightHtml : ""}
                  </div>
                </div>
                <div style="flex:1; height:100%; padding:18px 22px; background-color:#ffffff; border-radius: 0 16px 16px 0; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>${customBlockHtml}</div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "3") {
          // ---------------------------------------------------------
          // [TEMPLATE 3: DONNA STROUPE LAYOUT]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; padding:20px 24px; justify-content:space-between;">
              <div style="display:flex; align-items:center; width:100%; height:40mm; margin-bottom:12px; position:relative;">
                <div style="position:absolute; right:0; top:0; height:30mm; width:88%; background-color:${secColor}; border-radius:999px 0 0 999px; z-index:1; display:flex; align-items:center; padding-left:140px; box-sizing:border-box;">
                  <div>
                    <h1 style="font-size:26px; font-weight:700; letter-spacing:1px; color:${secondaryContrast}; margin:0; text-transform:uppercase;">${name}</h1>
                    <h2 style="font-size:13px; font-weight:500; color:${secondaryContrast}; opacity:0.85; margin-top:2px; letter-spacing:0.5px;">${subtitle}</h2>
                  </div>
                </div>

                <div style="position:absolute; left:16px; top:0; width:130px; height:130px; border-radius:50%; border:4px solid #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.08); overflow:hidden; z-index:10; background-color:#ffffff;">
                  ${profilePhotoHtml}
                </div>
              </div>

              <div style="display:flex; flex:1; justify-content:space-between; height:213mm;">
                <div style="width:68mm; background-color:${priColor}; color:${primaryContrast}; border-radius:1.5rem; padding:18px 14px; box-sizing:border-box; display:flex; flex-direction:column;">
                  <div style="display:block; margin-bottom:14px;">
                    <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                      <span style="display:inline-block; width:14px;">${getVectorIcon("phone", primaryContrast)}</span> ${phone}
                    </div>
                    <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; margin-bottom:6px; display:flex; align-items:center; gap:6px;">
                      <span style="display:inline-block; width:14px;">${getVectorIcon("mail", primaryContrast)}</span> ${email}
                    </div>
                    <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; display:flex; align-items:center; gap:6px;">
                      <span style="display:inline-block; width:14px;">${getVectorIcon("map", primaryContrast)}</span> ${location}
                    </div>
                  </div>

                  ${currentPurpose === "professional" ? `
                    <div style="display:block; margin-bottom:14px;">
                      <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnPri}; letter-spacing:0.5px; margin-bottom:3px;">Education</h3>
                      <div style="height:1.5px; background-color:${secOnPri}; opacity:0.3; margin-bottom:8px;"></div>
                      ${educations.map(edu => `
                        <div style="margin-bottom:8px;">
                          <div style="font-size:12px; font-weight:700; color:${primaryContrast};">${edu.inst}</div>
                          <div style="font-size:11.5px; font-weight:600; color:${primaryContrast}; opacity:0.8; margin-top:2px;">${edu.degree}</div>
                          <div style="font-size:10px; color:${primaryContrast}; opacity:0.6;">${edu.date}</div>
                        </div>
                      `).join("")}
                    </div>

                    <div style="display:block; margin-bottom:14px;">
                      <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnPri}; letter-spacing:0.5px; margin-bottom:3px;">Skills</h3>
                      <div style="height:1.5px; background-color:${secOnPri}; opacity:0.3; margin-bottom:8px;"></div>
                      <div style="display:block; padding-left:2px;">
                        ${skills.map(skill => `
                          <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; margin-bottom:4px; position:relative; padding-left:10px;">
                            <span style="position:absolute; left:0; top:5px; width:4px; height:4px; border-radius:50%; background-color:${secOnPri};"></span>
                            ${skill.name}
                          </div>
                        `).join("")}
                      </div>
                    </div>

                    <div style="display:block;">
                      <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnPri}; letter-spacing:0.5px; margin-bottom:3px;">Language</h3>
                      <div style="height:1.5px; background-color:${secOnPri}; opacity:0.3; margin-bottom:8px;"></div>
                      ${languages.map(lang => `
                        <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; margin-bottom:3px; font-weight:600;">${lang}</div>
                      `).join("")}
                    </div>
                  ` : `
                    <div style="display:block; margin-bottom:14px;">
                      <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${secOnPri}; letter-spacing:0.5px; margin-bottom:3px;">Quick Specifications</h3>
                      <div style="height:1.5px; background-color:${secOnPri}; opacity:0.3; margin-bottom:8px;"></div>
                      <div style="font-size:11.5px; color:${primaryContrast}; opacity:0.9; line-height:1.4;">
                        <div style="margin-bottom:4px;"><strong>Beliefs:</strong><br>${religion}</div>
                        <div style="margin-bottom:4px;"><strong>Gothra:</strong><br>${gothra}</div>
                        <div style="margin-bottom:4px;"><strong>Star:</strong><br>${horo}</div>
                        <div style="margin-bottom:4px;"><strong>Height:</strong><br>${height}</div>
                      </div>
                    </div>
                  `}
                </div>

                <div style="width:122mm; padding-left:14px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <div style="display:block; margin-bottom:12px;">
                      <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${priOnLight}; letter-spacing:0.5px; margin-bottom:3px;">About Me</h3>
                      <div style="height:1.5px; background-color:${priOnLight}; margin-bottom:8px;"></div>
                      <p style="font-size:11.5px; color:#4a5568; line-height:1.4 !important; text-align:justify; margin:0;">${about}</p>
                    </div>

                    ${currentPurpose === "professional" ? `
                      <div style="display:block; margin-bottom:12px;">
                        <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${priOnLight}; letter-spacing:0.5px; margin-bottom:3px;">Experience</h3>
                        <div style="height:1.5px; background-color:${priOnLight}; margin-bottom:10px;"></div>
                        ${experiences.map(exp => `
                          <div style="margin-bottom:10px; display:block;">
                            <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:700; color:${priOnLight};">
                              <span>${exp.role}</span>
                              <span style="font-weight:600; color:#7f8c8d; font-size:10.5px;">${exp.date}</span>
                            </div>
                            <div style="font-size:11.5px; font-style:italic; color:#7f8c8d; margin-top:2px; margin-bottom:4px;">${exp.company}</div>
                            <div style="display:block; padding-left:10px;">
                              ${exp.desc.split('\n').map(line => line.trim() ? `
                                <div style="font-size:11px; color:#4a5568; margin-bottom:2px; position:relative; text-align:justify; padding-left:8px;">
                                  <span style="position:absolute; left:0; top:5px; width:3.5px; height:3.5px; border-radius:50%; background-color:#7f8c8d;"></span>
                                  ${line}
                                </div>
                              ` : '').join('')}
                            </div>
                          </div>
                        `).join("")}
                      </div>
                      ${referencesBlockHtml}
                    ` : `
                      <div style="display:block; margin-bottom:12px;">
                        <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${priOnLight}; letter-spacing:0.5px; margin-bottom:3px;">Family Specifications</h3>
                        <div style="height:1.5px; background-color:${priOnLight}; margin-bottom:8px;"></div>
                        ${familyListHtml}
                      </div>

                      <div style="display:block;">
                        <h3 style="font-size:12px; font-weight:700; text-transform:uppercase; color:${priOnLight}; letter-spacing:0.5px; margin-bottom:3px;">Partner Expectations</h3>
                        <div style="height:1.5px; background-color:${priOnLight}; margin-bottom:8px;"></div>
                        <p style="font-size:11.5px; line-height:1.4 !important; color:#4a5568; text-align:justify; font-style:italic; margin:0; border-left: 2.5px solid ${secOnLight}; padding-left: 8px;">
                          "${expectations}"
                        </p>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "4") {
          // ---------------------------------------------------------
          // [TEMPLATE 4: INFOGRAPHIC SLATE (ADAM FLETCHER STYLE)]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; border-radius: 2rem; overflow:hidden; justify-content:space-between;">
              <div style="display:flex; width:100%; height:44mm; flex-shrink:0;">
                <div style="width:72mm; background-color:${secColor}; display:flex; align-items:center; justify-content:center; position:relative; box-sizing:border-box;">
                  <div style="width:130px; height:130px; border-radius:50%; border:4px solid #ffffff; box-shadow: 0 4px 8px rgba(0,0,0,0.1); overflow:hidden; background-color:#ffffff; z-index:10;">
                    ${profilePhotoHtml}
                  </div>
                </div>
                <div style="flex:1; background-color:${priColor}; color:${primaryContrast}; padding-left:22px; display:flex; flex-direction:column; justify-content:center; box-sizing:border-box;">
                  <h1 style="font-size:32px; font-weight:800; letter-spacing:0.5px; text-transform:uppercase; margin:0; line-height:1.0; color:${primaryContrast};">
                    ${firstName}<br><span style="font-weight:300;">${restOfName}</span>
                  </h1>
                  <h2 style="font-size:12px; font-weight:500; color:${secOnPri}; margin-top:4px; text-transform:uppercase; letter-spacing:1px;">${subtitle}</h2>
                </div>
              </div>

              <div style="display:flex; flex:1; height:253mm; box-sizing:border-box;">
                <div style="width:72mm; background-color:${secColor}; color:${secondaryContrast}; padding:18px 16px; box-sizing:border-box; display:flex; flex-direction:column; gap:14px; justify-content:space-between;">
                  <div>
                    <div style="margin-bottom:12px;">
                      <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${secondaryContrast}; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                        <i class="fa-solid fa-user" style="font-size:11px;"></i> About Me
                      </h3>
                      <p style="font-size:11.5px; color:${secondaryContrast}; opacity:0.9; line-height:1.4 !important; text-align:justify; margin:0;">${about}</p>
                    </div>

                    <div style="margin-bottom:12px;">
                      <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${secondaryContrast}; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                        <i class="fa-solid fa-address-card" style="font-size:11px;"></i> Contact
                      </h3>
                      <div style="font-size:11.5px; color:${secondaryContrast}; opacity:0.9; line-height:1.4;">
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                          <i class="fa-solid fa-phone" style="font-size:9px; width:12px; text-align:center;"></i> ${phone}
                        </div>
                        <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
                          <i class="fa-solid fa-envelope" style="font-size:9px; width:12px; text-align:center;"></i> ${email}
                        </div>
                        <div style="display:flex; align-items:center; gap:6px;">
                          <i class="fa-solid fa-location-dot" style="font-size:9px; width:12px; text-align:center;"></i> ${location}
                        </div>
                      </div>
                    </div>

                    ${currentPurpose === "professional" ? `
                      <div style="margin-bottom:12px;">
                        <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${secondaryContrast}; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                          <i class="fa-solid fa-gears" style="font-size:11px;"></i> Skills
                        </h3>
                        <ul style="list-style-type: none; padding:0; margin:0; font-size:11.5px; color:${secondaryContrast}; opacity:0.9;">
                          ${skills.map(s => `<li style="margin-bottom:3px; padding-left:8px; position:relative;"><span style="position:absolute; left:0; top:5px; width:3.5px; height:3.5px; border-radius:50%; background-color:${secondaryContrast};"></span>${s.name}</li>`).join("")}
                        </ul>
                      </div>

                      <div>
                        <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${secondaryContrast}; display:flex; align-items:center; gap:6px; margin-bottom:6px;">
                          <i class="fa-solid fa-language" style="font-size:11px;"></i> Language
                        </h3>
                        <ul style="list-style-type: none; padding:0; margin:0; font-size:11.5px; color:${secondaryContrast}; opacity:0.9;">
                          ${languages.map(l => `<li style="margin-bottom:3px; padding-left:8px; position:relative;"><span style="position:absolute; left:0; top:5px; width:3.5px; height:3.5px; border-radius:50%; background-color:${secondaryContrast};"></span>${l}</li>`).join("")}
                        </ul>
                      </div>
                    ` : `
                      <div>
                        <h3 style="font-size:12px; font-weight:800; text-transform:uppercase; color:${secondaryContrast}; display:flex; align-items:center; gap:6px; margin-bottom:8px;">
                          <i class="fa-solid fa-ring" style="font-size:11px;"></i> Quick Specs
                        </h3>
                        <div style="font-size:11px; color:${secondaryContrast}; opacity:0.9; line-height:1.4;">
                          <div style="margin-bottom:4px;"><strong>Beliefs:</strong> ${religion}</div>
                          <div style="margin-bottom:4px;"><strong>Gothra:</strong> ${gothra}</div>
                          <div style="margin-bottom:4px;"><strong>Horoscope:</strong> ${horo}</div>
                          <div style="margin-bottom:4px;"><strong>Height:</strong> ${height}</div>
                        </div>
                      </div>
                    `}
                  </div>
                </div>

                <div style="flex:1; background-color:#ffffff; padding:20px 22px; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    ${currentPurpose === "professional" ? `
                      <div style="margin-bottom:16px;">
                        <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; color:${priOnLight}; display:flex; align-items:center; gap:6px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:10px;">
                          <i class="fa-solid fa-graduation-cap"></i> Education
                        </h3>
                        ${educations.map(edu => `
                          <div style="display:flex; margin-bottom:10px;">
                            <div style="width:12px; position:relative; margin-right:10px;">
                              <div style="width:8px; height:8px; border-radius:50%; background-color:${priOnLight}; position:absolute; top:4px; left:2px;"></div>
                            </div>
                            <div style="flex:1;">
                              <div style="font-size:12px; font-weight:800; color:${priOnLight}; text-transform:uppercase;">${edu.date}</div>
                              <div style="font-size:11.5px; font-weight:700; color:#475569;">${edu.inst}</div>
                              <p style="font-size:11.5px; color:#64748b; margin:0; line-height:1.4;">${edu.degree}</p>
                            </div>
                          </div>
                        `).join("")}
                      </div>

                      <div style="margin-bottom:16px;">
                        <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; color:${priOnLight}; display:flex; align-items:center; gap:6px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:10px;">
                          <i class="fa-solid fa-briefcase"></i> Experience
                        </h3>
                        ${experiences.map(exp => `
                          <div style="display:flex; margin-bottom:10px;">
                            <div style="width:12px; position:relative; margin-right:10px;">
                              <div style="width:8px; height:8px; border-radius:50%; background-color:${priOnLight}; position:absolute; top:4px; left:2px;"></div>
                            </div>
                            <div style="flex:1;">
                              <div style="font-size:12px; font-weight:800; color:${priOnLight}; text-transform:uppercase;">${exp.date}</div>
                              <div style="font-size:11.5px; font-weight:700; color:#475569; text-transform:uppercase;">${exp.role}</div>
                              <div style="font-size:11px; font-style:italic; color:#64748b; margin-top:2px;">${exp.company}</div>
                              <p style="font-size:11px; color:#475569; margin-top:3px; line-height:1.4 !important; white-space:pre-line;">${exp.desc}</p>
                            </div>
                          </div>
                        `).join("")}
                      </div>
                      ${referencesBlockHtml}
                    ` : `
                      <div style="margin-bottom:14px;">
                        <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; color:${priOnLight}; display:flex; align-items:center; gap:6px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:10px;">
                          <i class="fa-solid fa-id-card"></i> Personal Info
                        </h3>
                        <table style="width:100%; border-collapse:collapse; font-size:11.5px; color:#475569;">
                          <tr><td style="padding:4px 0; font-weight:700; width:35%; color:${priOnLight};">Date of Birth:</td><td>${dob}</td></tr>
                          <tr><td style="padding:4px 0; font-weight:700; color:${priOnLight};">Place of Birth:</td><td>${pob}</td></tr>
                          <tr><td style="padding:4px 0; font-weight:700; color:${priOnLight};">Horoscope Sign:</td><td>${horo}</td></tr>
                          <tr><td style="padding:4px 0; font-weight:700; color:${priOnLight};">Clan/Gothra:</td><td>${gothra}</td></tr>
                        </table>
                      </div>

                      <div style="margin-bottom:14px;">
                        <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; color:${priOnLight}; display:flex; align-items:center; gap:6px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:10px;">
                          <i class="fa-solid fa-people-roof"></i> Family Lineage
                        </h3>
                        ${familyListHtml}
                      </div>

                      <div>
                        <h3 style="font-size:13px; font-weight:800; text-transform:uppercase; color:${priOnLight}; display:flex; align-items:center; gap:6px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:8px;">
                          <i class="fa-solid fa-heart"></i> Expected Partner
                        </h3>
                        <p style="font-size:11.5px; line-height:1.4 !important; color:#475569; text-align:justify; font-style:italic; margin:0; border-left: 2.5px solid ${priOnLight}; padding-left: 8px;">
                          "${expectations}"
                        </p>
                      </div>
                    `}
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "5") {
          // ---------------------------------------------------------
          // [TEMPLATE 5: ROTATED DIAMOND]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; justify-content:space-between; border: 4px double ${priOnLight}; padding: 12px; position: relative;">
              <div style="width:100%; display:flex; justify-content:space-between; align-items: center; padding:18px 10px; border-bottom:3px solid ${secOnLight}; height:46mm; box-sizing:border-box; background-color:#ffffff; position: relative; z-index: 10;">
                <div>
                  <h1 style="font-size:24px; font-weight:800; color:${priOnLight}; text-transform: uppercase; letter-spacing: 0.5px; margin: 0;">${name}</h1>
                  <h2 style="font-size:12.5px; font-weight:700; text-transform:uppercase; color:${secOnLight}; tracking:2px; margin-top:3px;">${subtitle}</h2>
                </div>
                <div style="width:110px; height:110px; transform:rotate(45deg); border:4px solid ${secOnLight}; overflow:hidden; background-color:#ffffff; flex-shrink:0; margin-right:16px; box-shadow: 2px 2px 8px rgba(0,0,0,0.15);">
                  <div style="transform:rotate(-45deg) scale(1.4); width:100%; height:100%; display: block;">
                    ${profilePhotoHtml}
                  </div>
                </div>
              </div>
              <div style="display:flex; flex:1; height:251mm; box-sizing:border-box; margin-top: 10px;">
                <div style="flex:1; height:100%; padding:10px 14px 10px 0; background-color:#ffffff; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between;">
                  <div>
                    <p style="font-size:11.5px; color:#4b5563; line-height:1.4 !important; margin-bottom:10px; text-align:justify;">${about}</p>
                    ${customBlockHtml}
                  </div>
                </div>
                <div style="width:74mm; height:100%; padding:18px 16px; background-color:#fafaf9; border-left:1px solid #e5e7eb; box-sizing:border-box; display:flex; flex-direction:column; justify-content:space-between; border-radius: 8px;">
                  <div>
                    <h3 style="font-size:12px; font-weight:800; color:${priOnLight}; tracking:1px; text-transform: uppercase; margin-bottom:10px; border-bottom: 2px solid ${secOnLight}; padding-bottom: 4px;">Contacts</h3>
                    <div style="font-size:11.5px; line-height:1.5; color:#4b5563;">
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("phone", priOnLight)}</span> ${phone}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("mail", priOnLight)}</span> ${email}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("map", priOnLight)}</span> ${location}</div>
                    </div>
                    ${currentPurpose === "professional" ? skillsOnLightHtml + languagesOnLightHtml : ""}
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "6") {
          // ---------------------------------------------------------
          // [TEMPLATE 6: TEAL WAVE CURVE]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; justify-content:space-between;">
              <div style="height:50mm; background-color:${priColor}; width:100%; display:flex; align-items:center; padding:16px 22px; box-sizing:border-box; overflow:hidden; flex-shrink:0;">
                <div style="display:flex; align-items:center; justify-content:space-between; background-color:${secColor}; width:147mm; height:36mm; border-radius:0 999px 999px 0; border:3px solid #ffffff; padding:0 22px; box-sizing:border-box; box-shadow:0 4px 8px rgba(0,0,0,0.12);">
                  <div style="max-width:87mm; color:${secondaryContrast};">
                    <h1 style="font-size:20px; font-weight:700; line-height:1.1; color:${secondaryContrast};">${name}</h1>
                    <p style="font-size:12px; font-weight:600; text-transform:uppercase; tracking:1px; margin-top:3px; opacity:0.9;">${subtitle}</p>
                  </div>
                  <div style="width:105px; height:105px; border-radius:50%; border:3px solid #ffffff; overflow:hidden; background-color:#ffffff; flex-shrink:0;">
                    ${profilePhotoHtml}
                  </div>
                </div>
              </div>
              <div style="display:flex; flex:1; height:247mm; box-sizing:border-box;">
                <div style="width:124mm; height:100%; padding:18px 22px; display:flex; flex-direction:column; justify-content:space-between; background-color:#ffffff; border-right:1px solid #f1f5f9; box-sizing:border-box;">
                  <div>${customBlockHtml}</div>
                </div>
                <div style="width:90mm; height:100%; display:flex; flex-direction:column; justify-content:space-between; background-color:#f8fafc; box-sizing:border-box;">
                  <div style="padding:18px 16px; background-color:${priColor}; color:${primaryContrast}; border-radius:0 0 0 1.5rem; min-height:38mm; box-sizing:border-box;">
                    <h3 style="font-size:12px; font-weight:700; tracking:1px; color:${secOnPri}; margin-bottom:5px;">Description</h3>
                    <p style="font-size:11.5px; line-height:1.4 !important; opacity:0.9; text-align:justify;">${about}</p>
                  </div>
                  <div style="padding:18px 16px; flex:1; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box;">
                    <div>
                      <h3 style="font-size:12px; font-weight:700; tracking:1px; color:${priOnLight}; margin-bottom:10px;">Contact Channels</h3>
                      <div style="font-size:11.5px; line-height:1.5; color:#475569;">
                        <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("phone", priOnLight)}</span> ${phone}</div>
                        <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("mail", priOnLight)}</span> ${email}</div>
                        <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("map", priOnLight)}</span> ${location}</div>
                      </div>
                      ${currentPurpose === "professional" ? skillsOnLightHtml + languagesOnLightHtml : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "7") {
          // ---------------------------------------------------------
          // [TEMPLATE 7: TERRACOTTA PILL]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#f5f5f4; padding:18px; justify-content:space-between;">
              <div style="background-color:#ffffff; border-radius:12px; padding:16px; display:flex; justify-content:space-between; align-items:center; height:46mm; border-top:5px solid ${priColor}; box-sizing:border-box; box-shadow:0 2px 6px rgba(0,0,0,0.04);">
                <div style="max-width:132mm;">
                  <h1 style="font-size:22px; font-weight:800; color:${priOnLight};">${name}</h1>
                  <h2 style="font-size:12px; font-weight:700; color:${secOnLight}; tracking:1px; margin-top:2px; text-transform:uppercase;">${subtitle}</h2>
                  <p style="font-size:11.5px; color:#6b7280; line-height:1.4 !important; margin-top:4px; text-align:justify;">${about}</p>
                </div>
                <div style="width:110px; height:110px; border-radius:1rem; overflow:hidden; border:2.5px solid ${priColor}; background-color:#f5f5f4; flex-shrink:0;">
                  ${profilePhotoHtml}
                </div>
              </div>
              <div style="display:flex; flex:1; gap:14px; margin-top:12px; height:219mm; box-sizing:border-box;">
                <div style="flex:1; background-color:#ffffff; border-radius:1rem; padding:16px; border-left:4px solid ${secOnLight}; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                  <div>
                    <h3 style="font-size:12px; font-weight:700; color:${priOnLight}; text-transform:uppercase; margin-bottom:10px;">Contact Methods</h3>
                    <div style="font-size:11.5px; line-height:1.5; color:#4b5563; margin-bottom:10px;">
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("phone", priOnLight)}</span> ${phone}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("mail", priOnLight)}</span> ${email}</div>
                      <div style="margin-bottom:6px;"><span style="display:inline-block; width:16px;">${getVectorIcon("map", priOnLight)}</span> ${location}</div>
                    </div>
                    ${currentPurpose === "professional" ? skillsOnLightHtml + languagesOnLightHtml : ""}
                  </div>
                </div>
                <div style="flex:1; background-color:#ffffff; border-radius:1rem; padding:16px; border-right:4px solid ${priColor}; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
                  <div>${customBlockHtml}</div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "8") {
          // ---------------------------------------------------------
          // [TEMPLATE 8: DOT-GRID CORNER]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; padding:24px; justify-content:space-between; position:relative; overflow:hidden;">
              <div style="position:absolute; inset:0; background-image:radial-gradient(${secColor} 1.2px, transparent 1.2px); background-size:14px 14px; opacity:0.1; pointer-events:none; z-index:1;"></div>
              
              <div style="position:absolute; top:0; left:0; width:50px; height:50px; background:linear-gradient(135deg, ${priColor} 50%, transparent 50%); z-index:2;"></div>
              <div style="position:absolute; bottom:0; right:0; width:50px; height:50px; background:linear-gradient(315deg, ${secColor} 50%, transparent 50%); z-index:2;"></div>

              <div style="display:flex; align-items:center; gap:20px; margin-top:12px; position:relative; z-index:3;">
                <div style="width:115px; height:115px; border:3px solid ${priColor}; background-color:#fafafa; flex-shrink:0; box-shadow:3px 3px 0px ${secColor};">
                  ${profilePhotoHtml}
                </div>
                <div>
                  <h1 style="font-size:26px; font-weight:800; color:${priOnLight}; margin:0; text-transform:uppercase; letter-spacing:0.5px;">${name}</h1>
                  <h2 style="font-size:12.5px; font-weight:700; color:#475569; tracking:1px; margin-top:3px; text-transform:uppercase;">${subtitle}</h2>
                </div>
              </div>

              <div style="display:flex; flex:1; margin-top:20px; gap:20px; position:relative; z-index:3; box-sizing:border-box;">
                <div style="width:70mm; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box;">
                  <div>
                    <h3 style="font-size:12px; font-weight:800; tracking:1px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:8px; color:${priOnLight}; text-transform:uppercase;">Personal Info</h3>
                    <div style="font-size:11.5px; line-height:1.5; color:#334155; margin-bottom:12px;">
                      <div style="margin-bottom:4px;"><span style="display:inline-block; width:16px;">${getVectorIcon("phone", priOnLight)}</span> ${phone}</div>
                      <div style="margin-bottom:4px;"><span style="display:inline-block; width:16px;">${getVectorIcon("mail", priOnLight)}</span> ${email}</div>
                      <div><span style="display:inline-block; width:16px;">${getVectorIcon("map", priOnLight)}</span> ${location}</div>
                    </div>

                    <h3 style="font-size:12px; font-weight:800; tracking:1px; border-bottom:2px solid ${secOnLight}; padding-bottom:4px; margin-bottom:8px; color:${priOnLight}; text-transform:uppercase;">Overview</h3>
                    <p style="font-size:11.5px; color:#334155; line-height:1.4 !important; text-align:justify; margin:0; margin-bottom:12px;">${about}</p>
                    
                    ${currentPurpose === "professional" ? skillsOnLightHtml + languagesOnLightHtml : ""}
                  </div>
                </div>

                <div style="width: 1.5px; background-color: #e2e8f0; position: relative;">
                  <div style="position: absolute; top: 0; bottom: 0; left: 0; width: 14px; background: linear-gradient(to right, rgba(0,0,0,0.06), transparent); pointer-events: none; z-index: 5;"></div>
                </div>

                <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box; padding-left:14px;">
                  <div>${customBlockHtml}</div>
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "9") {
          // ---------------------------------------------------------
          // [TEMPLATE 9: METRO LAYOUT (BESPOKE DARK)]
          // ---------------------------------------------------------
          const primaryBgContrast = getContrastColor(priColor);
          const gridCardColor = priColor;

          canvas.innerHTML = `
            <div style="display:flex; height:100%; width:100%; box-sizing:border-box; background-color:${secColor}; color:${secondaryContrast}; padding:18px; justify-content:space-between; position: relative;">
              <div style="flex:1; display:flex; flex-direction:column; justify-content:space-between; margin-right:12px; box-sizing:border-box;">
                <div style="padding:16px; border-radius:10px; background-color:${gridCardColor}; display:flex; align-items:center; justify-content:space-between; height:46mm; box-sizing:border-box; color:${primaryBgContrast}; box-shadow: 0 4px 12px rgba(0,0,0,0.12);">
                  <div>
                    <h1 style="font-size:22px; font-weight:800; color:${primaryBgContrast}; text-transform:uppercase; margin:0;">${name}</h1>
                    <h2 style="font-size:12px; font-weight:700; color:${secOnPri}; tracking:1px; margin-top:2px; text-transform:uppercase; margin-bottom:0;">${subtitle}</h2>
                  </div>
                  <div style="width:100px; height:100px; border-radius:6px; border:2.5px solid ${secOnPri}; overflow:hidden; background-color:#1e293b; flex-shrink:0;">
                    ${profilePhotoHtml}
                  </div>
                </div>

                <div style="background-color:${gridCardColor}; padding:16px; border-radius:10px; margin-top:12px; flex:1; box-sizing:border-box; overflow:hidden; color:${primaryBgContrast}; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  <div>${customBlockDarkHtml}</div>
                </div>
              </div>

              <div style="width:70mm; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box;">
                <div style="background-color:${gridCardColor}; padding:16px; border-radius:10px; margin-bottom:12px; box-sizing:border-box; color:${primaryBgContrast}; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  <h3 style="font-size:12px; font-weight:700; tracking:1px; color:${secOnPri}; margin-top:0; margin-bottom:5px; text-transform:uppercase;">About Me</h3>
                  <p style="font-size:11.5px; line-height:1.4 !important; color:${primaryBgContrast}; opacity: 0.95; text-align:justify; margin:0;">${about}</p>
                </div>

                <div style="background-color:${gridCardColor}; padding:16px; border-radius:10px; margin-bottom:12px; box-sizing:border-box; color:${primaryBgContrast}; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  <h3 style="font-size:12px; font-weight:700; tracking:1px; color:${secOnPri}; margin-top:0; margin-bottom:5px; text-transform:uppercase;">Contacts</h3>
                  <div style="font-size:11.5px; line-height:1.5; color:${primaryBgContrast}; opacity: 0.9;">
                    <div style="margin-bottom:3px;">📍 ${location}</div>
                    <div style="margin-bottom:3px;">📞 ${phone}</div>
                    <div style="margin-bottom:0;">✉️ ${email}</div>
                  </div>
                </div>

                <div style="background-color:${gridCardColor}; padding:16px; border-radius:10px; flex:1; box-sizing:border-box; display:flex; flex-direction:column; justify-content:start; color:${primaryBgContrast}; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
                  ${currentPurpose === "professional" ? `
                    <div style="margin-top:2px; margin-bottom:10px;">
                      <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnPri}; tracking:1px; margin-bottom:6px;">Core Skills</h3>
                      <div style="display:block;">
                        ${skills.map(skill => `
                          <div style="display:block; margin-bottom:4px;">
                            <div style="font-size:11.5px; font-weight:600; color:${primaryBgContrast}; display:flex; justify-content:space-between; line-height:1.2; opacity:0.95;">
                              <span>${skill.name}</span>
                              <span>${skill.level}%</span>
                            </div>
                            <div class="bar-container" style="background:rgba(255, 255, 255, 0.15); height:4px; margin-top:2px;">
                              <div class="bar-fill" style="width:${skill.level}%; background-color:${secOnPri}; height:100%;"></div>
                            </div>
                          </div>
                        `).join("")}
                      </div>
                    </div>
                    <div style="margin-top:10px;">
                      <h3 style="font-size:11.5px; font-weight:700; text-transform:uppercase; color:${secOnPri}; tracking:1px; margin-bottom:5px;">Languages</h3>
                      <div style="font-size:11.5px; color:${primaryBgContrast}; opacity:0.9; line-height:1.4;">
                        ${languages.map(lang => `<div style="margin-bottom:2px;">• ${lang}</div>`).join("")}
                      </div>
                    </div>
                  ` : `
                    <div>
                      <h3 style="font-size:12px; font-weight:700; tracking:1px; color:${secOnPri}; margin-top:0; margin-bottom:5px; text-transform:uppercase;">Preferences</h3>
                      <p style="font-size:11.5px; line-height:1.4 !important; color:${primaryBgContrast}; opacity:0.95; font-style:italic; margin:0;">
                        "${expectations}"
                      </p>
                    </div>
                  `}
                </div>
              </div>
            </div>
          `;
        } else if (currentTemplateId === "10") {
          // ---------------------------------------------------------
          // [TEMPLATE 10: B&W PHOTOGRAPHER]
          // ---------------------------------------------------------
          canvas.innerHTML = `
            <div style="display:flex; flex-direction:column; height:100%; width:100%; box-sizing:border-box; background-color:#ffffff; justify-content:space-between;">
              <div style="display:flex; width:100%; height:50mm; box-sizing:border-box;">
                <div style="width:72mm; height:100%; background-color:#e5e7eb; flex-shrink:0; overflow:hidden;">
                  ${profilePhotoHtml}
                </div>
                <div style="flex:1; height:100%; display:flex; flex-direction:column; justify-content:center; padding:18px; background-color:${priColor}; color:${primaryContrast}; box-sizing:border-box;">
                  <h1 style="font-size:24px; font-weight:300; letter-spacing:0.5px; margin:0; color:${primaryContrast};">${firstName} <strong style="font-weight:700; color:${primaryContrast};">${restOfName}</strong></h1>
                  <h2 style="font-size:12px; text-transform:uppercase; tracking:1.5px; color:${secOnPri}; margin-top:3px; font-style:italic;">${subtitle}</h2>
                </div>
              </div>
              <div style="display:flex; flex:1; box-sizing:border-box;">
                <div style="width:72mm; height:100%; padding:18px; background-color:${secColor}; color:${secondaryContrast}; display:flex; flex-direction:column; justify-content:space-between; box-sizing:border-box;">
                  <div>
                    <div style="margin-bottom:12px;">
                      <div style="background-color:${secondaryContrast === '#ffffff' ? '#ffffff' : '#1e293b'}; color:${secondaryContrast === '#ffffff' ? '#1e293b' : '#ffffff'}; font-size:9px; font-weight:700; text-transform:uppercase; tracking:1px; padding:3px 8px; display:inline-block; margin-bottom:5px;">My Bio</div>
                      <p style="font-size:11.5px; color:${secondaryContrast}; opacity:0.9; line-height:1.4 !important; text-align:justify; margin:0;">${about}</p>
                    </div>
                    <div style="margin-bottom:10px;">
                      <div style="background-color:${secondaryContrast === '#ffffff' ? '#ffffff' : '#1e293b'}; color:${secondaryContrast === '#ffffff' ? '#1e293b' : '#ffffff'}; font-size:9px; font-weight:700; text-transform:uppercase; tracking:1px; padding:3px 8px; display:inline-block; margin-bottom:5px;">My Contacts</div>
                      <div style="font-size:11.5px; color:${secondaryContrast}; opacity:0.9; line-height:1.5;">
                        <div>📞 ${phone}</div>
                        <div>✉️ ${email}</div>
                        <div>📍 ${location}</div>
                      </div>
                    </div>
                    ${currentPurpose === "professional" ? skillsSecBgHtml + languagesSecBgHtml : ""}
                  </div>
                </div>
                <div style="flex:1; height:100%; padding:18px 22px; background-color:#fafafa; box-sizing:border-box; color:#1e293b;">
                  <div>${customBlockHtml}</div>
                </div>
              </div>
            </div>
          `;
        }
      }

      // =========================================================================
      // [EXPORT UTILITY SYSTEM & HANDLERS]
      // =========================================================================
      
      // Launches native system browser printing flow configured to absolute page frames
      function exportPDF() {
        window.print();
      }

      // Invokes high-resolution raster capture engine (html-to-image)
      async function exportPNG() {
        const targetElement = document.getElementById("canvasTarget");
        const originalTransform = targetElement.style.transform;

        targetElement.style.transform = "none";
        targetElement.style.boxShadow = "none";

        await new Promise((resolve) => setTimeout(resolve, 150));
        await document.fonts.ready;

        const options = {
          quality: 1.0,
          pixelRatio: 3, 
          style: {
            transform: "none",
          },
        };

        htmlToImage
          .toPng(targetElement, options)
          .then((dataUrl) => {
            const link = document.createElement("a");
            link.download =
              currentPurpose === "professional"
                ? "A4-Calibrated-CV.png"
                : "A4-Calibrated-Matrimonial-Biodata.png";
            link.href = dataUrl;
            link.click();

            targetElement.style.transform = originalTransform;
            targetElement.style.boxShadow = "";
            showToast("High Resolution PNG exported successfully!");
          })
          .catch((error) => {
            console.error("The export pipeline experienced an issue:", error);
            targetElement.style.transform = originalTransform;
            targetElement.style.boxShadow = "";
          });
      }

      // Toast alert widget
      function showToast(msg) {
        const toast = document.getElementById("custom-alert-box");
        toast.innerText = msg;
        toast.style.display = "block";
        setTimeout(() => {
          toast.style.display = "none";
        }, 3000);
      }