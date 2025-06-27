const sections = document.querySelectorAll('section');

const observerOptions = {
    threshold: 0.2
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

async function loadPortfolioData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        populatePortfolio(data);
    } catch (error) {
        console.error('Error loading portfolio data:', error);
    }
}

function populatePortfolio(data) {
    // Profile Section
    document.getElementById('profileName').textContent = data.name;
    document.getElementById('profileTitle').textContent = data.profile.headline;
    document.getElementById('profileImage').src = 'image.jpg'; // Direct reference to image.jpg
    document.getElementById('bio').textContent = data.profile.about;
    document.getElementById('linkedinLink').href = data.profile.linkedin_url;

    // Experience Section
    const experienceContainer = document.getElementById('experienceContainer');
    data.experience.forEach(exp => {
        const expElement = document.createElement('div');
        expElement.className = 'experience-item';
        expElement.innerHTML = `
            <div class="exp-header">
                ${exp.company_logo ? `
                    <a href="${exp.company_linkedin_link}" target="_blank">
                        <img src="${exp.company_logo}" alt="${exp.company}" class="company-logo">
                    </a>` : ''}
                <div>
                    <h4>${exp.title}</h4>
                    ${exp.company_website_link ? 
                        `<p class="company"><a href="${exp.company_website_link}" target="_blank">${exp.company}</a></p>` :
                        `<p class="company">${exp.company}</p>`
                    }
                    <p class="period">${exp.start_date} - ${exp.end_date} · ${exp.duration}</p>
                </div>
            </div>
        `;
        experienceContainer.appendChild(expElement);
    });

    // Education Section
    const educationContainer = document.getElementById('educationContainer');
    data.education.forEach(edu => {
        const eduElement = document.createElement('div');
        eduElement.className = 'education-item';
        eduElement.innerHTML = `
            <div class="edu-header">
                ${edu.logo ? `
                    <a href="${edu.college_linkedin_link}" target="_blank">
                        <img src="${edu.logo}" alt="${edu.institution}" class="institution-logo">
                    </a>` : ''}
                <div>
                    <h4>${edu.degree}</h4>
                    ${edu.college_website_link ? 
                        `<p class="institution"><a href="${edu.college_website_link}" target="_blank">${edu.institution}</a></p>` :
                        `<p class="institution">${edu.institution}</p>`
                    }
                    <p>${edu.duration}</p>
                    <p>${edu.field}</p>
                </div>
            </div>
        `;
        educationContainer.appendChild(eduElement);
    });

    // Activities Section
    if (data.highlighted_activities) {
        const activitiesContainer = document.getElementById('activitiesContainer');
        data.highlighted_activities.forEach(activity => {
            const activityElement = document.createElement('div');
            activityElement.className = 'activity-item';
            activityElement.innerHTML = `
                <img src="${activity.image}" alt="${activity.title}">
                <h4>${activity.title}</h4>
                <a href="${activity.link}" target="_blank" class="activity-link">View Activity</a>
            `;
            activitiesContainer.appendChild(activityElement);
        });
    }

    // Skills Section
    const skillCategories = {
        'industrySkills': {
            title: 'Industry Knowledge',
            icon: 'fas fa-brain',
            skills: data.skills.industry_knowledge
        },
        'toolsSkills': {
            title: 'Tools & Technologies',
            icon: 'fas fa-tools',
            skills: data.skills.tools_and_technologies
        },
        'programmingSkills': {
            title: 'Programming Languages',
            icon: 'fas fa-code',
            skills: data.skills.programming_languages
        },
        'librariesSkills': {
            title: 'Libraries & Frameworks',
            icon: 'fas fa-puzzle-piece',
            skills: data.skills.libraries_frameworks
        },
        'conceptsSkills': {
            title: 'Concepts & Approaches',
            icon: 'fas fa-lightbulb',
            skills: data.skills.concepts_approaches
        },
        'interpersonalSkills': {
            title: 'Interpersonal Skills',
            icon: 'fas fa-users',
            skills: data.skills.interpersonal_skills
        }
    };

    const skillsContainer = document.querySelector('.skills-container');
    skillsContainer.innerHTML = '';

    for (const [categoryId, category] of Object.entries(skillCategories)) {
        const categoryElement = document.createElement('div');
        categoryElement.className = 'skills-category';
        categoryElement.innerHTML = `
            <div class="skills-header">
                <i class="${category.icon}"></i>
                <h3>${category.title}</h3>
                <span class="skill-count">${category.skills.length}</span>
                <i class="fas fa-chevron-down arrow"></i>
            </div>
            <div class="skills-list" id="${categoryId}">
                ${category.skills.map(skill => `
                    <div class="skill-item">
                        <span class="skill-name">${skill}</span>
                        <div class="skill-level">
                            <div class="skill-level-fill"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
        skillsContainer.appendChild(categoryElement);

        // ✅ Fixed toggle behavior - only one section open at a time
        const header = categoryElement.querySelector('.skills-header');
        header.addEventListener('click', function () {
            const allCategories = document.querySelectorAll('.skills-category');

            allCategories.forEach(cat => {
                if (cat !== categoryElement) {
                    cat.classList.remove('active');
                }
            });

            categoryElement.classList.toggle('active');
        });
    }
}

// Initialize the portfolio
document.addEventListener('DOMContentLoaded', loadPortfolioData);

// Add these at the beginning of your script.js
document.addEventListener('DOMContentLoaded', () => {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 10%';
            navbar.style.background = 'rgba(17, 24, 39, 0.98)';
        } else {
            navbar.style.padding = '1.5rem 10%';
            navbar.style.background = 'rgba(17, 24, 39, 0.95)';
        }
    });

    // Active nav item
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });
});

// 3D Tilt Animation for Project Cards
document.querySelectorAll('.work-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; // x position within the card
        const y = e.clientY - rect.top;  // y position within the card
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * 10; // max 10deg
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
        card.classList.add('tilted');
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        card.classList.remove('tilted');
    });

    card.addEventListener('mousedown', () => {
        card.style.transform += ' scale(0.97)';
    });

    card.addEventListener('mouseup', () => {
        card.style.transform = card.style.transform.replace(' scale(0.97)', '');
    });
});

// Fetch data from data.json
fetch('data.json')
    .then(response => response.json())
    .then(data => {
        // Update experience section
        const aimerz = data.experience[0];
        const education = data.education[0];

        // Update AIMERZ experience
        const aimerzLogo = document.querySelector('.experience-section .timeline-item:first-child .timeline-logo');
        aimerzLogo.innerHTML = `
            <a href="${aimerz.company_linkedin_link}" target="_blank">
                <img src="${aimerz.company_logo}" alt="${aimerz.company}">
            </a>
        `;

        // Update company name with website link
        const aimerzCompany = document.querySelector('.experience-section .timeline-item:first-child .timeline-content .company');
        aimerzCompany.innerHTML = `<a href="${aimerz.company_website_link}" target="_blank">${aimerz.company}</a>`;

        // Update Education section
        const educationLogo = document.querySelector('.education-section .timeline-item .timeline-logo');
        educationLogo.innerHTML = `
            <a href="${education.college_linkedin_link}" target="_blank">
                <img src="${education.logo}" alt="${education.institution}">
            </a>
        `;
        
        // Update education content with website link
        const educationContent = document.querySelector('.education-section .timeline-item .timeline-content');
        educationContent.innerHTML = `
            <h3>${education.degree}</h3>
            <p class="company"><a href="${education.college_website_link}" target="_blank">${education.institution}</a></p>
            <p class="duration">${education.duration}</p>
        `;
    })
    .catch(error => console.error('Error loading data:', error));
