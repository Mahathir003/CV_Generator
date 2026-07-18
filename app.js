      /* === app.js === */
      let uploadedImageBase64 = "";
      let currentZoom = 0.6;
      let currentPurpose = "professional"; // 'professional' or 'marital'
      let currentTemplateId = "1"; // Default Template
      let userModifiedColors = false; // Persistent flag to prevent switching templates from overriding modified colors

      // Dynamic reactive list state arrays
      let cvExperience = [];
      let cvEducation = [];
      let cvSkills = [];
      let cvLanguages = [];
      let cvExtraCurricular = [];

      let maritalJobs = [];
      let maritalRelatives = [];

      // Vector SVG Icons Helper
      function getIconSvg(type, color = "#ffffff") {
        const icons = {
          phone: `<svg class="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;transform:translateY(-1px);"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
          email: `<svg class="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;transform:translateY(-1px);"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
          location: `<svg class="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;transform:translateY(-1px);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
          web: `<svg class="w-3.5 h-3.5 inline-block mr-1.5" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:13px;height:13px;transform:translateY(-1px);"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
          education: `<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;transform:translateY(-1px);"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
          experience: `<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;transform:translateY(-1px);"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
          skills: `<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;transform:translateY(-1px);"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
          specs: `<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;transform:translateY(-1px);"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
          languages: `<svg class="w-4 h-4 inline-block mr-2" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:15px;height:15px;transform:translateY(-1px);"><path d="M5 8h14M5 12h14M5 16h14"/></svg>`,
          crown: `<svg class="w-5 h-5 inline" fill="none" stroke="${color}" stroke-width="2" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" style="width:20px;height:20px;"><path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/></svg>`,
          bullet: `<svg class="w-2 h-2 inline" fill="none" stroke="${color}" stroke-width="3.5" viewBox="0 0 24 24" style="width:6px;height:6px;display:block;"><circle cx="12" cy="12" r="10"/></svg>`,
        };
        return icons[type] || "";
      }

      const templateColorProfiles = {
        professional: {
          1: { primary: "#0b192c", secondary: "#eab308" }, // Navy / Gold
          2: { primary: "#65453a", secondary: "#9a7b56" }, // Chocolate Brown
          3: { primary: "#22252c", secondary: "#f2a0a5" }, // Grey & Warm Pink
          4: { primary: "#1d2021", secondary: "#7d7d7d" }, // Split Black & Dark Gray
          5: { primary: "#7d5a50", secondary: "#b4846c" }, // Brown Rotated Diamond Theme
          6: { primary: "#2d3748", secondary: "#319795" }, // Teal wave layout
          7: { primary: "#824c3a", secondary: "#d4a373" }, // Terracotta pill
          8: { primary: "#8a3324", secondary: "#1e1e1e" }, // Rust dot-grid angle
          9: { primary: "#2a2244", secondary: "#a855f7" }, // Creative Metro Cards
          10: { primary: "#111111", secondary: "#64748b" }, // B&W Split Photographer
        },
        marital: {
          1: { primary: "#7a1c2e", secondary: "#c5a059" },
          2: { primary: "#60142b", secondary: "#cca43b" },
          3: { primary: "#500a15", secondary: "#dcae1d" },
          4: { primary: "#70123c", secondary: "#e0b034" },
          5: { primary: "#800c1e", secondary: "#cc9e40" },
          6: { primary: "#6a091a", secondary: "#cfa640" },
          7: { primary: "#5c0816", secondary: "#d4b35e" },
          8: { primary: "#6d152b", secondary: "#d4af37" },
          9: { primary: "#7a1a2b", secondary: "#d4af37" },
          10: { primary: "#3a020b", secondary: "#d4af37" },
        },
      };

      const sampleMockData = {
        professional: {
          name: "Mariana Napolitani",
          subtitle: "Professional Designer",
          about:
            "I am a passionate graphic designer with over 7 years of active expertise turning abstract complex ideas into striking, clean, multi-layered visual stories and high-conversion assets.",
          phone: "+123-456-7890",
          email: "hello@reallygreatsite.com",
          loc: "123 Anywhere St., Any City",
          web: "www.reallygreatsite.com",
          skills: [
            "Project Management",
            "Problem-Solving",
            "Creativity",
            "Leadership",
            "Illustration Design",
            "Marketing Strategy",
          ],
          languages: [
            "English (Native)",
            "Italian (Fluent)",
            "Spanish (Conversational)",
          ],
          experience: [
            {
              role: "Senior Graphic Designer",
              company: "Larana & Rimberio Designs Co.",
              date: "2020 - Present",
              desc: "Orchestrated global packaging and visual systems for 40+ dynamic retail brands. Scaled conversion design models resulting in average 25% growth metric indexes.",
            },
            {
              role: "Junior Brand Strategist",
              company: "Wardiere Advertising Agency",
              date: "2017 - 2020",
              desc: "Crafted organic social marketing architectures, custom high-fidelity vector illustration packages, and digital layouts optimized for conversion funnels.",
            },
          ],
          education: [
            {
              degree: "Bachelor of Graphic Design",
              inst: "Larana University",
              date: "2013 - 2017",
            },
            {
              degree: "Advanced Color Informatics Course",
              inst: "Rimberio Creative Inst.",
              date: "2018 - 2019",
            },
          ],
          curricular: [
            {
              title: "Visual Arts Mentor Award",
              desc: "Honored for outstanding community designer empowerment sessions.",
            },
            {
              title: "National Design Exhibition",
              desc: "Showcased vector illustration installations in 2023.",
            },
          ],
        },
        marital: {
          name: "Aarav Sharma",
          subtitle: "Cloud Solutions Architect",
          about:
            "A progressive yet deeply grounded technology professional with an outlook focused on mutual growth, fine literature, and organic farming.",
          phone: "+91-98765-43210",
          email: "aarav.sharma@emailservice.in",
          loc: "New Delhi, India",
          web: "linkedin.com/in/aaravsh",
          religion: "Hindu / Brahmin",
          gothra: "Vashishta",
          horo: "Aries / Ashwini",
          height: "5 Feet 11 Inches",
          dob: "12th April 1996",
          pob: "New Delhi, India",
          expect:
            "Seeking an educated, understanding partner with modern outlooks yet holding deep respect for traditional family values and shared goals.",
          jobs: [
            {
              role: "Lead Systems Architect",
              org: "Microsoft Corp (Redmond / Cloud Division)",
              timeline: "2021 - Present (Package: 35 LPA)",
            },
            {
              role: "Senior Developer Analyst",
              org: "Cognizant Financial Solutions",
              timeline: "2018 - 2021",
            },
          ],
          relatives: [
            {
              name: "Suresh Sharma",
              relation: "Father",
              designation: "Sr. Director, Indian Railways",
            },
            {
              name: "Dr. Ramesh Sharma",
              relation: "Paternal Uncle",
              designation: "Chief Medical Officer",
            },
            {
              name: "Mrs. Shashi Mishra",
              relation: "Maternal Aunt",
              designation: "Senior Academic Dean",
            },
            {
              name: "Brig. Vijay K. Sharma",
              relation: "Maternal Uncle",
              designation: "Retd. Indian Army Brigadier",
            },
            {
              name: "Kiran Sharma",
              relation: "Mother",
              designation: "Professor of History, DU",
            },
            {
              name: "Rohan Sharma",
              relation: "Elder Brother",
              designation: "Sr. Architect (London)",
            },
          ],
        },
      };

      window.onload = function () {
        document.getElementById("canvasTarget").style.transform =
          `scale(${currentZoom})`;
        loadSampleData();
      };

      function selectTemplate(templateId) {
        currentTemplateId = templateId;

        // Remove active style from all custom template cards
        const cards = document.querySelectorAll(".template-card-btn");
        cards.forEach((card) => card.classList.remove("active"));

        // Add active class to selected card
        const activeCard = document.getElementById(`tplBtn-${templateId}`);
        if (activeCard) {
          activeCard.classList.add("active");
        }

        // Sync visual color palettes dynamically if not touched by user
        if (!userModifiedColors) {
          const profileColors =
            templateColorProfiles[currentPurpose][templateId];
          if (profileColors) {
            document.getElementById("primaryColor").value =
              profileColors.primary;
            document.getElementById("secondaryColor").value =
              profileColors.secondary;
            updateCanvasColors(false);
          }
        }

        renderLivePreview();
      }

      function switchPurpose(purpose) {
        currentPurpose = purpose;

        // Adjust purpose button states
        document.getElementById("purpose-prof").className =
          "py-1.5 px-3 rounded-md text-xs font-semibold text-slate-400";
        document.getElementById("purpose-marital").className =
          "py-1.5 px-3 rounded-md text-xs font-semibold text-slate-400";

        if (purpose === "professional") {
          document
            .getElementById("purpose-prof")
            .classList.add("purpose-btn-active");
          document
            .getElementById("form-prof-fields")
            .classList.remove("hidden");
          document
            .getElementById("form-marital-fields")
            .classList.add("hidden");
        } else {
          document
            .getElementById("purpose-marital")
            .classList.add("purpose-btn-active");
          document.getElementById("form-prof-fields").classList.add("hidden");
          document
            .getElementById("form-marital-fields")
            .classList.remove("hidden");
        }

        // Apply contextual default colors unless customized
        if (!userModifiedColors) {
          const profileColors =
            templateColorProfiles[purpose][currentTemplateId];
          if (profileColors) {
            document.getElementById("primaryColor").value =
              profileColors.primary;
            document.getElementById("secondaryColor").value =
              profileColors.secondary;
            updateCanvasColors(false);
          }
        }

        loadSampleData();
      }

      function loadSampleData() {
        const data = sampleMockData[currentPurpose];

        document.getElementById("f-name").value = data.name;
        document.getElementById("f-subtitle").value = data.subtitle;
        document.getElementById("f-about").value = data.about;
        document.getElementById("f-phone").value = data.phone;
        document.getElementById("f-email").value = data.email;
        document.getElementById("f-loc").value = data.loc;
        document.getElementById("f-web").value = data.web;

        if (currentPurpose === "professional") {
          // Populate Professional Arrays
          cvExperience = [...data.experience];
          cvEducation = [...data.education];
          cvSkills = [...data.skills];
          cvLanguages = [...data.languages];
          cvExtraCurricular = [...data.curricular];

          renderCvExperienceInputs();
          renderCvEducationInputs();
          renderCvSkillsInputs();
          renderCvLanguageInputs();
          renderCvCurricularInputs();
        } else {
          document.getElementById("b-religion").value = data.religion;
          document.getElementById("b-gothra").value = data.gothra;
          document.getElementById("b-horo").value = data.horo;
          document.getElementById("b-height").value = data.height;
          document.getElementById("b-dob").value = data.dob;
          document.getElementById("b-pob").value = data.pob;
          document.getElementById("b-expect").value = data.expect;

          maritalJobs = [...data.jobs];
          maritalRelatives = [...data.relatives];

          renderMaritalJobsInputs();
          renderRelativesInputs();
        }

        // Initialize active template state
        selectTemplate(currentTemplateId);
      }

      // Dynamic Experience Inputs
      function addCvExperience() {
        if (cvExperience.length >= 3) return;
        const role = document.getElementById("exp-role").value.trim();
        const company = document.getElementById("exp-comp").value.trim();
        const date = document.getElementById("exp-date").value.trim();
        const desc = document.getElementById("exp-desc").value.trim();

        if (!role || !company) return;

        cvExperience.push({ role, company, date, desc });
        document.getElementById("exp-role").value = "";
        document.getElementById("exp-comp").value = "";
        document.getElementById("exp-date").value = "";
        document.getElementById("exp-desc").value = "";

        renderCvExperienceInputs();
        renderLivePreview();
      }

      function deleteCvExperience(index) {
        cvExperience.splice(index, 1);
        renderCvExperienceInputs();
        renderLivePreview();
      }

      function renderCvExperienceInputs() {
        const container = document.getElementById("cv-experience-container");
        container.innerHTML = "";
        cvExperience.forEach((exp, index) => {
          container.innerHTML += `
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs gap-2">
                        <div class="flex-1 truncate">
                            <strong>${exp.role}</strong> — ${exp.company} <span class="text-[10px] text-slate-400 block">${exp.date}</span>
                        </div>
                        <button class="text-rose-500 hover:text-rose-400 p-1 cursor-pointer w-auto" onclick="deleteCvExperience(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        });
      }

      function addCvEducation() {
        if (cvEducation.length >= 3) return;
        const degree = document.getElementById("edu-degree").value.trim();
        const inst = document.getElementById("edu-inst").value.trim();
        const date = document.getElementById("edu-date").value.trim();

        if (!degree || !inst) return;

        cvEducation.push({ degree, inst, date });
        document.getElementById("edu-degree").value = "";
        document.getElementById("edu-inst").value = "";
        document.getElementById("edu-date").value = "";

        renderCvEducationInputs();
        renderLivePreview();
      }

      function deleteCvEducation(index) {
        cvEducation.splice(index, 1);
        renderCvEducationInputs();
        renderLivePreview();
      }

      function renderCvEducationInputs() {
        const container = document.getElementById("cv-education-container");
        container.innerHTML = "";
        cvEducation.forEach((edu, index) => {
          container.innerHTML += `
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs gap-2">
                        <div class="flex-1 truncate">
                            <strong>${edu.degree}</strong> — ${edu.inst} <span class="text-[10px] text-slate-400 block">${edu.date}</span>
                        </div>
                        <button class="text-rose-500 hover:text-rose-400 p-1 cursor-pointer w-auto" onclick="deleteCvEducation(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        });
      }

      function addCvSkill() {
        if (cvSkills.length >= 6) return;
        const skill = document.getElementById("skill-input").value.trim();
        if (!skill) return;

        cvSkills.push(skill);
        document.getElementById("skill-input").value = "";
        renderCvSkillsInputs();
        renderLivePreview();
      }

      function deleteCvSkill(index) {
        cvSkills.splice(index, 1);
        renderCvSkillsInputs();
        renderLivePreview();
      }

      function renderCvSkillsInputs() {
        const container = document.getElementById("cv-skills-container");
        container.innerHTML = "";
        cvSkills.forEach((skill, index) => {
          container.innerHTML += `
                    <span class="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs">
                        ${skill}
                        <button class="text-rose-500 hover:text-rose-400 cursor-pointer w-auto p-0 inline-flex items-center" onclick="deleteCvSkill(${index})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </span>
                `;
        });
      }

      function addCvLanguage() {
        if (cvLanguages.length >= 4) return;
        const lang = document.getElementById("language-input").value.trim();
        if (!lang) return;

        cvLanguages.push(lang);
        document.getElementById("language-input").value = "";
        renderCvLanguageInputs();
        renderLivePreview();
      }

      function deleteCvLanguage(index) {
        cvLanguages.splice(index, 1);
        renderCvLanguageInputs();
        renderLivePreview();
      }

      function renderCvLanguageInputs() {
        const container = document.getElementById("cv-languages-container");
        container.innerHTML = "";
        cvLanguages.forEach((lang, index) => {
          container.innerHTML += `
                    <span class="inline-flex items-center gap-1.5 bg-slate-800 border border-slate-700 text-slate-200 px-2.5 py-1 rounded text-xs">
                        ${lang}
                        <button class="text-rose-500 hover:text-rose-400 cursor-pointer w-auto p-0 inline-flex items-center" onclick="deleteCvLanguage(${index})">
                            <i class="fa-solid fa-xmark"></i>
                        </button>
                    </span>
                `;
        });
      }

      function addCvCurricular() {
        if (cvExtraCurricular.length >= 3) return;
        const title = document.getElementById("curricular-title").value.trim();
        const desc = document.getElementById("curricular-desc").value.trim();

        if (!title) return;

        cvExtraCurricular.push({ title, desc });
        document.getElementById("curricular-title").value = "";
        document.getElementById("curricular-desc").value = "";

        renderCvCurricularInputs();
        renderLivePreview();
      }

      function deleteCvCurricular(index) {
        cvExtraCurricular.splice(index, 1);
        renderCvCurricularInputs();
        renderLivePreview();
      }

      function renderCvCurricularInputs() {
        const container = document.getElementById("cv-curricular-container");
        container.innerHTML = "";
        cvExtraCurricular.forEach((curr, index) => {
          container.innerHTML += `
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs gap-2">
                        <div class="flex-1 truncate">
                            <strong>${curr.title}</strong> <span class="text-[10px] text-slate-400 block">${curr.desc}</span>
                        </div>
                        <button class="text-rose-500 hover:text-rose-400 p-1 cursor-pointer w-auto" onclick="deleteCvCurricular(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        });
      }

      // Dynamic Marital Jobs
      function addMaritalJob() {
        if (maritalJobs.length >= 2) return;
        const roleVal = document.getElementById("j-role").value.trim();
        const orgVal = document.getElementById("j-org").value.trim();
        const timelineVal = document.getElementById("j-timeline").value.trim();

        if (!roleVal || !orgVal) return;

        maritalJobs.push({ role: roleVal, org: orgVal, timeline: timelineVal });
        document.getElementById("j-role").value = "";
        document.getElementById("j-org").value = "";
        document.getElementById("j-timeline").value = "";

        renderMaritalJobsInputs();
        renderLivePreview();
      }

      function deleteMaritalJob(index) {
        maritalJobs.splice(index, 1);
        renderMaritalJobsInputs();
        renderLivePreview();
      }

      function renderMaritalJobsInputs() {
        const container = document.getElementById("marital-jobs-container");
        container.innerHTML = "";
        maritalJobs.forEach((job, index) => {
          container.innerHTML += `
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs gap-2">
                        <div class="flex-1 truncate">
                            <strong>${job.role}</strong> — ${job.org} <span class="text-[10px] text-slate-400 block">${job.timeline}</span>
                        </div>
                        <button class="text-rose-500 hover:text-rose-400 p-1 cursor-pointer w-auto" onclick="deleteMaritalJob(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        });
      }

      // Dynamic Relatives Registry (Merged)
      function addRelative() {
        if (maritalRelatives.length >= 6) return;
        const nameVal = document.getElementById("r-name").value.trim();
        const relationVal = document.getElementById("r-relation").value.trim();
        const statusVal = document.getElementById("r-status").value.trim();

        if (!nameVal || !relationVal) return;

        maritalRelatives.push({
          name: nameVal,
          relation: relationVal,
          designation: statusVal,
        });
        document.getElementById("r-name").value = "";
        document.getElementById("r-relation").value = "";
        document.getElementById("r-status").value = "";

        renderRelativesInputs();
        renderLivePreview();
      }

      function deleteRelative(index) {
        maritalRelatives.splice(index, 1);
        renderRelativesInputs();
        renderLivePreview();
      }

      function renderRelativesInputs() {
        const container = document.getElementById(
          "marital-relatives-container",
        );
        container.innerHTML = "";
        maritalRelatives.forEach((relative, index) => {
          container.innerHTML += `
                    <div class="flex items-center justify-between bg-slate-800 p-2 rounded border border-slate-700 text-xs gap-2">
                        <div class="flex-1 truncate">
                            <strong>${relative.name}</strong> <span class="text-[10px] text-slate-400 block">${relative.relation} — ${relative.designation || "N/A"}</span>
                        </div>
                        <button class="text-rose-500 hover:text-rose-400 p-1 cursor-pointer w-auto" onclick="deleteRelative(${index})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                `;
        });
      }

      // Color and Font Control
      function updateCanvasColors(isUserAction) {
        if (isUserAction) {
          userModifiedColors = true; // Mark as customized to retain across templates
        }
        const primary = document.getElementById("primaryColor").value;
        const secondary = document.getElementById("secondaryColor").value;
        document.documentElement.style.setProperty("--primary-color", primary);
        document.documentElement.style.setProperty(
          "--secondary-color",
          secondary,
        );
        renderLivePreview();
      }

      function updateCanvasFont() {
        const font = document.getElementById("activeFont").value;
        document.documentElement.style.setProperty("--font-family", font);
        renderLivePreview();
      }

      function handleImageUpload() {
        const file = document.getElementById("imageInput").files[0];
        const reader = new FileReader();
        reader.onloadend = function () {
          uploadedImageBase64 = reader.result;
          renderLivePreview();
        };
        if (file) {
          reader.readAsDataURL(file);
        }
      }

      function zoomCanvas(delta) {
        currentZoom = Math.max(0.3, Math.min(1.2, currentZoom + delta));
        applyZoom();
      }

      function resetZoom() {
        currentZoom = 0.6;
        applyZoom();
      }

      function applyZoom() {
        document.getElementById("canvasTarget").style.transform =
          `scale(${currentZoom})`;
        document.getElementById("zoomDisplay").innerText =
          `Zoom: ${Math.round(currentZoom * 100)}%`;
      }

      function getCommonFields() {
        return {
          name: document.getElementById("f-name").value || "YOUR NAME",
          subtitle:
            document.getElementById("f-subtitle").value || "Professional Title",
          about:
            document.getElementById("f-about").value ||
            "Statement summary of your profile background.",
          phone: document.getElementById("f-phone").value || "+000 0000 000",
          email: document.getElementById("f-email").value || "email@domain.com",
          loc: document.getElementById("f-loc").value || "City, Country",
          web: document.getElementById("f-web").value || "www.website.com",

          // Professional Dynamic arrays
          skills: cvSkills,
          languages: cvLanguages,
          experience: cvExperience,
          education: cvEducation,
          curricular: cvExtraCurricular,

          // Matrimonial Parameters
          religion: document.getElementById("b-religion")
            ? document.getElementById("b-religion").value
            : "",
          gothra: document.getElementById("b-gothra")
            ? document.getElementById("b-gothra").value
            : "",
          horo: document.getElementById("b-horo")
            ? document.getElementById("b-horo").value
            : "",
          height: document.getElementById("b-height")
            ? document.getElementById("b-height").value
            : "",
          dob: document.getElementById("b-dob")
            ? document.getElementById("b-dob").value
            : "",
          pob: document.getElementById("b-pob")
            ? document.getElementById("b-pob").value
            : "",
          expect: document.getElementById("b-expect")
            ? document.getElementById("b-expect").value
            : "",
          relatives: maritalRelatives,
        };
      }

      function getProfileImageHtml(roundedClass = "rounded-full") {
        if (uploadedImageBase64) {
          return `<img src="${uploadedImageBase64}" class="w-full h-full object-cover ${roundedClass}" alt="Profile">`;
        }
        return `<div class="w-full h-full bg-slate-200 flex flex-col items-center justify-center text-[10px] text-slate-500 font-bold p-2 text-center ${roundedClass}">PHOTO</div>`;
      }

      /* Robust deterministic Header Render Helper - Eliminates baseline offsets in outputs */
      function getRibbonHeaderHtml(title, primaryBg, secondaryColor, fontName) {
        return `
          <div style="display: block; margin-bottom: 12px; margin-top: 16px;">
            <div style="display: block; height: 28px; font-size: 0; white-space: nowrap;">
              <div style="display: inline-block; background-color: ${secondaryColor}; height: 28px; line-height: 28px; padding: 0 16px; font-family: ${fontName}; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1.2px; color: #ffffff; vertical-align: top; box-sizing: border-box; border-radius: 4px 0 0 4px;">
                ${title}
              </div>
              <div style="display: inline-block; vertical-align: top; width: 8px; height: 28px; box-sizing: border-box;">
                <svg width="8" height="28" viewBox="0 0 8 28" preserveAspectRatio="none" style="display: block; width: 100%; height: 100%;">
                  <path d="M0 0 L0 28 L8 14 Z" fill="${secondaryColor}" />
                </svg>
              </div>
            </div>
          </div>
        `;
      }

      /* Standard Flow Timeline Entry - Prevents overlapping skill bar alignments */
      function getTimelineEntryHtml(title, subtitle, timeline, desc, dotColor, fontName) {
        return `
          <div style="display: block; margin-bottom: 12px; font-family: ${fontName};">
            <div style="font-size: 0; display: block; line-height: 1; margin-bottom: 4px;">
              <div style="display: inline-block; width: 70%; font-size: 11px; font-weight: 700; color: #1e293b; vertical-align: top;">
                <span style="display: inline-block; width: 6px; height: 6px; border-radius: 50%; background-color: ${dotColor}; margin-right: 8px; vertical-align: middle; transform: translateY(-1px);"></span>
                <span style="vertical-align: middle;">${title}</span>
              </div>
              <div style="display: inline-block; width: 30%; font-size: 10px; font-weight: 700; color: ${dotColor}; text-align: right; vertical-align: top;">
                ${timeline}
              </div>
            </div>
            <div style="display: block; padding-left: 14px;">
              <div style="font-size: 10px; font-weight: 500; color: #64748b; margin-bottom: 3px;">${subtitle}</div>
              ${desc ? `<p style="font-size: 10px; color: #475569; line-height: 1.4 !important; margin: 0; text-align: justify;">${desc}</p>` : ""}
            </div>
          </div>
        `;
      }

      function renderLivePreview() {
        const data = getCommonFields();
        const canvas = document.getElementById("canvasTarget");

        const primary = document.getElementById("primaryColor").value;
        const secondary = document.getElementById("secondaryColor").value;
        const fontName = document.getElementById("activeFont").value;

        // Extract first/rest name segments
        const nameParts = data.name.split(" ");
        const firstName = nameParts[0] || "";
        const restOfName = nameParts.slice(1).join(" ") || "";

        canvas.innerHTML = "";

        let leftSidebarBlock = "";
        let midBlock1 = "";
        let midBlock2 = "";

        if (currentPurpose === "professional") {
          leftSidebarBlock = `
            <div style="display: block; margin-bottom: 24px; font-family: ${fontName};">
                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${secondary}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    ${getIconSvg("skills", secondary)} Skills
                </h3>
                <div style="display: block; line-height: 1.5;">
                    ${data.skills
                      .slice(0, 6)
                      .map(
                        (skill) => `
                        <div style="display: block; margin-bottom: 8px;">
                            <div style="font-size: 11px; color: #ffffff; font-weight: 500;">${skill}</div>
                            <div class="bar-container"><div class="bar-fill" style="width: 85%; background-color: ${secondary};"></div></div>
                        </div>
                    `,
                      )
                      .join("")}
                </div>
            </div>
            ${
              data.languages.length > 0
                ? `
            <div style="display: block; font-family: ${fontName};">
                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${secondary}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    ${getIconSvg("languages", secondary)} Languages
                </h3>
                <div style="display: block; font-size: 11px; color: #e2e8f0;">
                    ${data.languages
                      .slice(0, 4)
                      .map((lang) => `<div style="margin-bottom: 4px;">• ${lang}</div>`)
                      .join("")}
                </div>
            </div>`
                : ""
            }
          `;

          midBlock1 = `
            <div style="display: block; margin-bottom: 16px;">
              ${getRibbonHeaderHtml("Academic Background", primary, secondary, fontName)}
              <div style="display: block; padding-top: 4px;">
                ${
                  data.education.length > 0
                    ? data.education
                        .slice(0, 3)
                        .map((edu) =>
                          getTimelineEntryHtml(
                            edu.degree,
                            edu.inst,
                            edu.date,
                            "",
                            secondary,
                            fontName
                          )
                        )
                        .join("")
                    : `<p style="font-size: 10px; color: #94a3b8; font-style: italic; font-family: ${fontName};">No academic history recorded.</p>`
                }
              </div>
            </div>
          `;

          midBlock2 = `
            <div style="display: block; margin-bottom: 16px;">
              ${getRibbonHeaderHtml("Work Experience", primary, secondary, fontName)}
              <div style="display: block; padding-top: 4px;">
                ${
                  data.experience.length > 0
                    ? data.experience
                        .slice(0, 3)
                        .map((exp) =>
                          getTimelineEntryHtml(
                            exp.role,
                            exp.company,
                            exp.date,
                            exp.desc,
                            secondary,
                            fontName
                          )
                        )
                        .join("")
                    : `<p style="font-size: 10px; color: #94a3b8; font-style: italic; font-family: ${fontName};">No work experience recorded.</p>`
                }
              </div>
            </div>
            ${
              data.curricular.length > 0
                ? `
            <div style="display: block; margin-bottom: 16px;">
              ${getRibbonHeaderHtml("Accomplishments", primary, secondary, fontName)}
              <div style="display: block; padding-top: 4px; font-family: ${fontName};">
                ${data.curricular
                  .slice(0, 3)
                  .map(
                    (curr) => `
                    <div style="display: block; margin-bottom: 8px; padding-left: 14px;">
                      <div style="font-size: 11px; font-weight: 700; color: #1e293b;">${curr.title}</div>
                      <div style="font-size: 10px; color: #64748b;">${curr.desc}</div>
                    </div>
                  `,
                  )
                  .join("")}
              </div>
            </div>`
                : ""
            }
          `;
        } else {
          // Marital layout structures
          leftSidebarBlock = `
            <div style="display: block; margin-bottom: 24px; font-family: ${fontName};">
                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${secondary}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                    ${getIconSvg("specs", secondary)} Personal Specs
                </h3>
                <table style="width: 100%; border-collapse: collapse; font-size: 10.5px; color: #e2e8f0;">
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700; width: 50%;">Beliefs:</td>
                    <td style="padding: 4px 0;">${data.religion || "Brahmin"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700;">Sect/Clan:</td>
                    <td style="padding: 4px 0;">${data.gothra || "Vashishta"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700;">Star/Horo:</td>
                    <td style="padding: 4px 0;">${data.horo || "Ashwini"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700;">Height:</td>
                    <td style="padding: 4px 0;">${data.height || "5ft 11in"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700;">DOB:</td>
                    <td style="padding: 4px 0;">${data.dob || "12th Apr 1996"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 4px 0; font-weight: 700;">Place:</td>
                    <td style="padding: 4px 0;">${data.pob || "New Delhi"}</td>
                  </tr>
                </table>
            </div>
          `;

          midBlock1 = `
            <div style="display: block; margin-bottom: 16px;">
              ${getRibbonHeaderHtml("Family Profile", primary, secondary, fontName)}
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-family: ${fontName};">
                ${
                  data.relatives.length > 0
                    ? data.relatives
                        .slice(0, 6)
                        .map(
                          (rel) => `
                        <div style="padding: 8px; border-radius: 4px; background-color: #f8fafc; border-left: 2px solid #94a3b8; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
                            <div style="font-size: 10px; font-weight: 700; color: #0f172a;">${rel.name}</div>
                            <div style="font-size: 8.5px; font-weight: 700; color: ${secondary}; text-transform: uppercase;">${rel.relation}</div>
                            <div style="font-size: 9px; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${rel.designation || "N/A"}</div>
                        </div>
                    `,
                        )
                        .join("")
                    : `<p style="font-size: 10px; color: #94a3b8; font-style: italic; col-span: 2;">No family details recorded.</p>`
                }
              </div>
            </div>
          `;

          midBlock2 = `
            <div style="display: block; margin-bottom: 16px;">
              ${getRibbonHeaderHtml("Professional Registry", primary, secondary, fontName)}
              <div style="display: block; padding-top: 4px;">
                ${
                  maritalJobs.length > 0
                    ? maritalJobs
                        .slice(0, 2)
                        .map((job) =>
                          getTimelineEntryHtml(
                            job.role,
                            job.org,
                            job.timeline,
                            "",
                            secondary,
                            fontName
                          )
                        )
                        .join("")
                    : `<p style="font-size: 10px; color: #94a3b8; font-style: italic; font-family: ${fontName};">No professional background recorded.</p>`
                }
              </div>
            </div>
            <div style="display: block; margin-top: 12px; font-family: ${fontName};">
              ${getRibbonHeaderHtml("Expected Partner", primary, secondary, fontName)}
              <div style="padding: 10px; border-radius: 6px; background-color: #fafaf9; border-left: 3px solid ${secondary}; margin-top: 6px;">
                <p style="font-size: 10px; font-style: italic; color: #475569; line-height: 1.4 !important; margin: 0; text-align: justify;">
                  "${data.expect || "Expectations summary..."}"
                </p>
              </div>
            </div>
          `;
        }

        if (currentTemplateId === "1") {
          canvas.innerHTML = `
            <div style="display: flex; height: 100%; width: 100%; box-sizing: border-box; font-family: ${fontName};">
                <div style="width: 72mm; height: 100%; background-color: ${primary}; display: flex; flex-direction: column; padding: 24px; box-sizing: border-box; justify-content: space-between; color: #ffffff; relative;">
                    <div>
                        <div style="width: 100px; height: 100px; margin: 20px auto; border-radius: 50%; border: 3px solid ${secondary}; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                            ${getProfileImageHtml("rounded-full")}
                        </div>
                        
                        <div style="display: block; margin-bottom: 24px;">
                            <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${secondary}; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                ${getIconSvg("specs", secondary)} Contact Channels
                            </h3>
                            <div style="display: block; font-size: 11px; line-height: 1.6;">
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("location", secondary)} ${data.loc}</div>
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("phone", secondary)} ${data.phone}</div>
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("web", secondary)} ${data.web}</div>
                                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("email", secondary)} ${data.email}</div>
                            </div>
                        </div>
                        
                        ${leftSidebarBlock}
                    </div>
                </div>
                
                <div style="flex: 1; height: 100%; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; background-color: #ffffff; box-sizing: border-box;">
                    <div>
                        <div style="display: block; margin-bottom: 16px;">
                            <h1 style="font-size: 28px; font-weight: 800; color: ${primary}; letter-spacing: -0.5px; margin: 0; line-height: 1.15;">${data.name}</h1>
                            <h2 style="font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-top: 4px;">${data.subtitle}</h2>
                            <p style="font-size: 10.5px; color: #334155; line-height: 1.5 !important; margin-top: 12px; text-align: justify;">${data.about}</p>
                        </div>
                        
                        ${midBlock1}
                        ${midBlock2}
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "2") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #fafaf9; font-family: ${fontName};">
                <div style="display: flex; align-items: center; justify-content: space-between; padding: 24px; background-color: ${primary}; color: #ffffff; height: 50mm; box-sizing: border-box;">
                    <div style="max-width: 130mm;">
                        <h1 style="font-size: 26px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #ffffff; line-height: 1.1;">${data.name}</h1>
                        <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: ${secondary}; letter-spacing: 2px; margin-top: 4px;">${data.subtitle}</h2>
                        <p style="font-size: 10px; color: #d6d3d1; line-height: 1.4 !important; margin-top: 8px; text-align: justify;">${data.about}</p>
                    </div>
                    <div style="width: 90px; height: 90px; border: 3px solid ${secondary}; box-sizing: border-box; overflow: hidden; flex-shrink: 0;">
                        ${getProfileImageHtml("rounded-none")}
                    </div>
                </div>
                
                <div style="display: flex; flex-1; height: 247mm; box-sizing: border-box;">
                    <div style="width: 72mm; height: 100%; padding: 24px; background-color: #f5f5f4; border-right: 1px solid #e7e5e4; display: flex; flex-direction: column; box-sizing: border-box; justify-content: space-between;">
                        <div>
                            <div style="display: block; margin-bottom: 24px;">
                                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; color: ${primary}; margin-bottom: 12px;">Contact Channels</h3>
                                <div style="display: block; font-size: 10px; color: #44403c; line-height: 1.6;">
                                    <div style="margin-bottom: 4px;">${getIconSvg("phone", primary)} ${data.phone}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("email", primary)} ${data.email}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("location", primary)} ${data.loc}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("web", primary)} ${data.web}</div>
                                </div>
                            </div>
                            ${leftSidebarBlock}
                        </div>
                    </div>
                    
                    <div style="flex: 1; height: 100%; padding: 24px 32px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; background-color: #ffffff;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "3") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #ffffff; font-family: ${fontName};">
                <div style="width: 100%; background-color: ${primary}; height: 50mm; display: flex; justify-content: space-between; align-items: center; padding: 24px; box-sizing: border-box; color: #ffffff; relative;">
                    <div style="max-width: 130mm;">
                        <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 600; color: #cbd5e1; letter-spacing: 2px;">Greetings, I'm</h2>
                        <h1 style="font-size: 28px; font-weight: 800; color: #ffffff; line-height: 1.15; margin-top: 2px;">${data.name}</h1>
                        <span style="display: inline-block; margin-top: 6px; padding: 4px 10px; font-size: 9px; font-weight: 700; text-transform: uppercase; tracking: 1.5px; border-radius: 4px; background-color: ${secondary}; color: #ffffff;">${data.subtitle}</span>
                    </div>
                    <div style="width: 100px; height: 100px; border: 3px solid ${secondary}; border-radius: 12px; overflow: hidden; flex-shrink: 0; box-shadow: 0 4px 12px rgba(0,0,0,0.25); background-color: #ffffff;">
                        ${getProfileImageHtml("rounded-2xl")}
                    </div>
                </div>
                
                <div style="display: flex; flex-1; height: 247mm; box-sizing: border-box;">
                    <div style="width: 72mm; height: 100%; padding: 24px; background-color: #fafaf9; border-right: 1px solid #f3f4f6; display: flex; flex-direction: column; box-sizing: border-box; justify-content: space-between;">
                        <div>
                            <div style="display: block; margin-bottom: 24px;">
                                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: ${secondary}; letter-spacing: 1px; margin-bottom: 12px;">Contacts</h3>
                                <div style="display: block; font-size: 10px; color: #4b5563; line-height: 1.6;">
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("location", secondary)} ${data.loc}</div>
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("phone", secondary)} ${data.phone}</div>
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("email", secondary)} ${data.email}</div>
                                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">${getIconSvg("web", secondary)} ${data.web}</div>
                                </div>
                            </div>
                            ${leftSidebarBlock}
                        </div>
                    </div>
                    
                    <div style="flex: 1; height: 100%; padding: 24px 32px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; background-color: #ffffff;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "4") {
          canvas.innerHTML = `
            <div style="display: flex; height: 100%; width: 100%; box-sizing: border-box; background-color: #fafafa; font-family: ${fontName};">
                <div style="width: 75mm; height: 100%; background-color: ${primary}; display: flex; flex-direction: column; padding: 24px; box-sizing: border-box; justify-content: space-between; color: #ffffff;">
                    <div>
                        <div style="width: 100px; height: 100px; border-radius: 50%; overflow: hidden; border: 2px solid ${secondary}; margin-bottom: 24px;">
                            ${getProfileImageHtml("rounded-full")}
                        </div>
                        
                        <div style="display: block; margin-bottom: 24px;">
                            <h3 style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; border-bottom: 1px solid #334155; padding-bottom: 4px; margin-bottom: 12px; color: #cbd5e1;">Contact Info</h3>
                            <div style="display: block; font-size: 10px; color: #94a3b8; line-height: 1.6;">
                                <div style="margin-bottom: 4px;">${getIconSvg("phone", secondary)} ${data.phone}</div>
                                <div style="margin-bottom: 4px;">${getIconSvg("location", secondary)} ${data.loc}</div>
                                <div style="margin-bottom: 4px;">${getIconSvg("email", secondary)} ${data.email}</div>
                            </div>
                        </div>
                        
                        ${leftSidebarBlock}
                    </div>
                </div>
                
                <div style="flex: 1; height: 100%; padding: 32px; display: flex; flex-direction: column; justify-content: space-between; background-color: #e7e5e4; box-sizing: border-box;">
                    <div>
                        <div style="display: block; margin-bottom: 16px;">
                            <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase; tracking: -1px; color: #1c1917; margin: 0; line-height: 1.05;">${firstName}</h1>
                            <h1 style="font-size: 32px; font-weight: 900; text-transform: uppercase; tracking: -1px; color: #1c1917; margin: 0; line-height: 1.05; margin-bottom: 4px;">${restOfName}</h1>
                            <h2 style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: ${primary}; font-style: italic;">${data.subtitle}</h2>
                            <p style="font-size: 10.5px; color: #44403c; line-height: 1.45 !important; margin-top: 12px; text-align: justify;">${data.about}</p>
                        </div>
                        
                        ${midBlock1}
                        ${midBlock2}
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "5") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #ffffff; font-family: ${fontName};">
                <div style="width: 100%; display: flex; justify-content: space-between; padding: 24px; border-bottom: 4px solid ${primary}; height: 50mm; box-sizing: border-box; background-color: #ffffff; relative;">
                    <div>
                        <h1 style="font-size: 26px; font-weight: 700; color: ${primary}; letter-spacing: -0.5px; margin: 0;">${data.name}</h1>
                        <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 800; color: ${secondary}; tracking: 2px; margin-top: 4px;">${data.subtitle}</h2>
                    </div>
                    
                    <div style="width: 90px; height: 90px; transform: rotate(45deg); border: 3px solid ${secondary}; overflow: hidden; background-color: #ffffff; box-shadow: 0 4px 10px rgba(0,0,0,0.15); flex-shrink: 0; margin-right: 12px;">
                        <div style="transform: rotate(-45deg) scale(1.4); width: 100%; height: 100%;">
                            ${getProfileImageHtml("rounded-none")}
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; flex-1; height: 247mm; box-sizing: border-box;">
                    <div style="flex: 1; height: 100%; padding: 24px 32px; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; background-color: #ffffff;">
                        <div>
                            <p style="font-size: 10.5px; color: #4b5563; line-height: 1.45 !important; margin-bottom: 12px; text-align: justify;">${data.about}</p>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                    
                    <div style="width: 75mm; height: 100%; padding: 24px; background-color: #fafaf9; border-left: 1px solid #f3f4f6; display: flex; flex-direction: column; box-sizing: border-box; justify-content: space-between;">
                        <div>
                            <div style="display: block; margin-bottom: 24px;">
                                <h3 style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: ${primary}; letter-spacing: 1px; margin-bottom: 12px;">Contacts</h3>
                                <div style="display: block; font-size: 10px; color: #4b5563; line-height: 1.6;">
                                    <div style="margin-bottom: 4px;">${getIconSvg("phone", primary)} ${data.phone}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("email", primary)} ${data.email}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("web", primary)} ${data.web}</div>
                                    <div style="margin-bottom: 4px;">${getIconSvg("location", primary)} ${data.loc}</div>
                                </div>
                            </div>
                            ${leftSidebarBlock}
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "6") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #ffffff; font-family: ${fontName}; justify-content: space-between;">
                <div style="height: 58mm; background-color: ${primary}; width: 100%; display: flex; align-items: center; padding: 24px; box-sizing: border-box; relative; overflow: hidden; flex-shrink: 0;">
                    <div style="display: flex; align-items: center; justify-content: space-between; background-color: ${secondary}; width: 145mm; height: 38mm; border-radius: 0 999px 999px 0; border: 4px solid #ffffff; padding: 0 24px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); box-sizing: border-box;">
                        <div style="max-width: 85mm; color: #ffffff;">
                            <h1 style="font-size: 22px; font-weight: 700; letter-spacing: -0.5px; line-height: 1.1;">${data.name}</h1>
                            <p style="font-size: 10px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-top: 4px; opacity: 0.9;">${data.subtitle}</p>
                        </div>
                        <div style="width: 80px; height: 80px; rounded-radius: 50%; border: 4px solid #ffffff; overflow: hidden; background-color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.15); flex-shrink: 0;">
                            ${getProfileImageHtml("rounded-full")}
                        </div>
                    </div>
                </div>

                <div style="display: flex; flex-1; height: 239mm; relative; box-sizing: border-box;">
                    <div style="width: 122mm; height: 100%; padding: 24px; display: flex; flex-direction: column; justify-content: space-between; background-color: #ffffff; border-right: 1px solid #f1f5f9; box-sizing: border-box;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>

                    <div style="width: 88mm; height: 100%; display: flex; flex-direction: column; justify-content: space-between; background-color: #f8fafc; box-sizing: border-box;">
                        <div style="padding: 24px; background-color: ${primary}; color: #ffffff; border-radius: 0 0 0 2rem; min-height: 40mm; box-sizing: border-box;">
                            <h3 style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; color: ${secondary}; margin-bottom: 8px;">My Profile</h3>
                            <p style="font-size: 9.5px; line-height: 1.4 !important; opacity: 0.9; text-align: justify;">${data.about}</p>
                        </div>

                        <div style="margin: -16px 12px 0 12px; padding: 8px 16px; border-radius: 9999px; display: flex; justify-content: space-between; font-size: 9px; color: #ffffff; background-color: ${secondary}; box-shadow: 0 2px 4px rgba(0,0,0,0.1); relative; z-index: 10;">
                            <span>📞 ${data.phone}</span>
                            <span>✉️ ${data.email}</span>
                        </div>

                        <div style="padding: 24px; flex-1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                            ${leftSidebarBlock}

                            <div style="padding: 12px; border-radius: 8px; background-color: ${primary}; color: #ffffff; display: flex; align-items: center; justify-content: space-between;">
                                <div style="font-size: 9px;">
                                    <h4 style="font-weight: 700; text-transform: uppercase; color: ${secondary};">Direct Line</h4>
                                    <p style="opacity: 0.8;">${data.email}</p>
                                </div>
                                ${getIconSvg("crown", secondary)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "7") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #f5f5f4; padding: 24px; justify-content: space-between; font-family: ${fontName};">
                <div style="background-color: #ffffff; border-radius: 16px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); display: flex; justify-content: space-between; align-items: center; height: 48mm; border-top: 6px solid ${primary}; box-sizing: border-box;">
                    <div style="max-width: 130mm;">
                        <h1 style="font-size: 26px; font-weight: 800; color: ${primary}; letter-spacing: -0.5px; margin: 0;">${data.name}</h1>
                        <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${secondary}; letter-spacing: 1.5px; margin-top: 2px;">${data.subtitle}</h2>
                        <p style="font-size: 10px; color: #6b7280; line-height: 1.4 !important; margin-top: 6px; text-align: justify;">${data.about}</p>
                    </div>
                    <div style="width: 85px; height: 85px; border-radius: 1.5rem; overflow: hidden; border: 3px solid ${primary}; background-color: #f5f5f4; flex-shrink: 0;">
                        ${getProfileImageHtml("rounded-[1.5rem]")}
                    </div>
                </div>

                <div style="display: flex; flex-1; gap: 16px; margin-top: 16px; height: 210mm; box-sizing: border-box;">
                    <div style="flex: 1; background-color: #f5f5f4; border-radius: 1.5rem; padding: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); border-left: 4px solid ${secondary}; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        ${leftSidebarBlock}
                    </div>

                    <div style="flex: 1; background-color: #f5f5f4; border-radius: 1.5rem; padding: 20px; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02); border-right: 4px solid ${primary}; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>

                        <div style="border-top: 1px solid #e7e5e4; padding-top: 12px; font-size: 10px; color: #44403c; line-height: 1.5;">
                            <div>${getIconSvg("phone", primary)} ${data.phone}</div>
                            <div>${getIconSvg("email", primary)} ${data.email}</div>
                            <div>${getIconSvg("location", primary)} ${data.loc}</div>
                            <div>${getIconSvg("web", primary)} ${data.web}</div>
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "8") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #ffffff; padding: 24px; justify-content: space-between; font-family: ${fontName};">
                <div style="display: flex; align-items: center; gap: 20px; margin-top: 12px; z-index: 10;">
                    <div style="width: 90px; height: 90px; border: 3px solid ${primary}; background-color: #f5f5f4; flex-shrink: 0; box-shadow: 0 4px 8px rgba(0,0,0,0.15);">
                        ${getProfileImageHtml("rounded-none")}
                    </div>
                    <div>
                        <h1 style="font-size: 26px; font-weight: 800; color: ${primary}; letter-spacing: -0.5px; margin: 0;">${data.name}</h1>
                        <h2 style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #6b7280; letter-spacing: 1.5px; margin-top: 2px;">${data.subtitle}</h2>
                    </div>
                </div>

                <div style="display: flex; flex-1; margin-top: 24px; gap: 24px; z-index: 10; box-sizing: border-box;">
                    <div style="width: 68mm; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        <div style="display: block;">
                            <div style="display: block; margin-bottom: 20px;">
                                <h3 style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; border-bottom: 2px solid ${secondary}; padding-bottom: 4px; margin-bottom: 8px; color: ${primary};">Personal Info</h3>
                                <div style="display: block; font-size: 10px; color: #4b5563; line-height: 1.6;">
                                    <div>${getIconSvg("phone", primary)} ${data.phone}</div>
                                    <div>${getIconSvg("email", primary)} ${data.email}</div>
                                    <div>${getIconSvg("location", primary)} ${data.loc}</div>
                                    <div>${getIconSvg("web", primary)} ${data.web}</div>
                                </div>
                            </div>

                            <div style="display: block; margin-bottom: 20px;">
                                <h3 style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; border-bottom: 2px solid ${secondary}; padding-bottom: 4px; margin-bottom: 8px; color: ${primary};">Description</h3>
                                <p style="font-size: 10px; color: #4b5563; line-height: 1.45 !important; text-align: justify; margin: 0;">${data.about}</p>
                            </div>
                            
                            ${leftSidebarBlock}
                        </div>
                    </div>

                    <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; padding-left: 20px; border-left: 1px solid #e5e7eb;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "9") {
          canvas.innerHTML = `
            <div style="display: flex; height: 100%; width: 100%; box-sizing: border-box; background-color: #0f172a; color: #cbd5e1; padding: 24px; font-family: ${fontName};">
                <div style="flex: 1; display: flex; flex-direction: column; justify-content: space-between; margin-right: 16px; box-sizing: border-box;">
                    <div style="padding: 20px; border-radius: 12px; background-color: ${primary}; display: flex; align-items: center; justify-content: space-between; height: 48mm; box-sizing: border-box;">
                        <div>
                            <h1 style="font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; margin: 0; text-transform: uppercase;">${data.name}</h1>
                            <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 700; color: ${secondary}; letter-spacing: 1.5px; margin-top: 4px;">${data.subtitle}</h2>
                        </div>
                        <div style="width: 80px; height: 80px; border-radius: 8px; border: 3px solid ${secondary}; overflow: hidden; background-color: #1e293b; flex-shrink: 0; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
                            ${getProfileImageHtml("rounded-none")}
                        </div>
                    </div>

                    <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-top: 16px; flex-1; box-sizing: border-box; color: #1e293b;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                </div>

                <div style="width: 72mm; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                    <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; margin-bottom: 16px; box-sizing: border-box;">
                        <h3 style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; color: ${secondary}; margin-bottom: 8px;">Direct Contacts</h3>
                        <div style="display: block; font-size: 10px; color: #94a3b8; line-height: 1.6;">
                            <div>📍 ${data.loc}</div>
                            <div>📞 ${data.phone}</div>
                            <div>✉️ ${data.email}</div>
                        </div>
                    </div>

                    <div style="background-color: #1e293b; padding: 20px; border-radius: 12px; border: 1px solid #334155; flex-1; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        ${leftSidebarBlock}
                    </div>
                </div>
            </div>
          `;
        } else if (currentTemplateId === "10") {
          canvas.innerHTML = `
            <div style="display: flex; flex-direction: column; height: 100%; width: 100%; box-sizing: border-box; background-color: #ffffff; justify-content: space-between; font-family: ${fontName};">
                <div style="display: flex; width: 100%; height: 55mm; box-sizing: border-box;">
                    <div style="width: 75mm; height: 100%; background-color: #e5e7eb; overflow: hidden; flex-shrink: 0;">
                        ${getProfileImageHtml("rounded-none")}
                    </div>
                    
                    <div style="flex: 1; height: 100%; display: flex; flex-direction: column; justify-content: center; padding: 24px; background-color: ${primary}; color: #ffffff; box-sizing: border-box;">
                        <div style="width: 48px; height: 2px; background-color: #ffffff; margin-bottom: 12px;"></div>
                        <h1 style="font-size: 26px; font-weight: 300; letter-spacing: 1px; margin: 0;">${firstName} <strong style="font-weight: 700;">${restOfName}</strong></h1>
                        <h2 style="font-size: 11px; text-transform: uppercase; font-weight: 500; letter-spacing: 2px; color: ${secondary}; margin-top: 4px; font-style: italic;">${data.subtitle}</h2>
                    </div>
                </div>

                <div style="display: flex; flex-1; box-sizing: border-box;">
                    <div style="width: 75mm; height: 100%; padding: 24px; background-color: ${primary}; color: #ffffff; display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box;">
                        <div style="display: block;">
                            <div style="display: block; margin-bottom: 20px;">
                                <div style="background-color: #ffffff; color: #000000; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 3px 8px; display: inline-block; margin-bottom: 8px;">My Profile</div>
                                <p style="font-size: 9.5px; color: #cbd5e1; line-height: 1.4 !important; text-align: justify; margin: 0;">${data.about}</p>
                            </div>
                            
                            <div style="display: block; margin-bottom: 20px;">
                                <div style="background-color: #ffffff; color: #000000; font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; padding: 3px 8px; display: inline-block; margin-bottom: 8px;">My Contact</div>
                                <div style="display: block; font-size: 9.5px; color: #cbd5e1; line-height: 1.6;">
                                    <div>📞 ${data.phone}</div>
                                    <div>✉️ ${data.email}</div>
                                    <div>📍 ${data.loc}</div>
                                    <div>🌐 ${data.web}</div>
                                </div>
                            </div>

                            ${leftSidebarBlock}
                        </div>
                    </div>

                    <div style="flex: 1; height: 100%; padding: 24px 32px; display: flex; flex-direction: column; justify-content: space-between; background-color: #fcfcfc; box-sizing: border-box; color: #1e293b;">
                        <div>
                            ${midBlock1}
                            ${midBlock2}
                        </div>
                    </div>
                </div>
            </div>
          `;
        }
      }

      async function captureUnscaledCanvas() {
        const targetElement = document.getElementById("canvasTarget");

        // Set scaling temporarily to standard bounds (1:1 format)
        const savedTransform = targetElement.style.transform;
        targetElement.style.transform = "none";
        targetElement.style.boxShadow = "none";

        // Wait a small delay to allow font settlement inside rendering sandbox
        await new Promise((resolve) => setTimeout(resolve, 150));
        await document.fonts.ready;

        const options = {
          quality: 1.0,
          pixelRatio: 3, // Premium high print density
          style: {
            transform: "none",
          },
        };

        const canvasDataUrl = await htmlToImage.toPng(targetElement, options);

        // Restore preview zoom transform
        targetElement.style.transform = savedTransform;
        targetElement.style.boxShadow = "";

        return canvasDataUrl;
      }

      async function exportHighResPNG() {
        try {
          const pngUrl = await captureUnscaledCanvas();
          const imageLink = document.createElement("a");
          imageLink.download =
            currentPurpose === "professional"
              ? "A4-Premium-Calibrated-CV.png"
              : "A4-Matrimonial-Marriage-Biodata.png";
          imageLink.href = pngUrl;
          imageLink.click();
        } catch (err) {
          console.error("PNG export pipeline failed:", err);
        }
      }

      /* Native programmatic PDF generator bypassing baseline estimation limitations of html2canvas */
      function exportPDFDirect() {
        window.print();
      }
      /* === End of app.js === */