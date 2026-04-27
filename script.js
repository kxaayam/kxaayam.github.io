// Scroll-triggered top bar for project pages + smooth anchor scrolling
document.addEventListener('DOMContentLoaded', function() {
    const topbar = document.querySelector('.project-topbar');
    const isPositionality = document.body.classList.contains('positionality-page');

    if (topbar) {
        if (isPositionality) {
            topbar.classList.add('visible');
            topbar.style.transform = 'translateY(0)';
            topbar.style.opacity = '1';
        } else {
            const updateTopbar = () => {
                if (window.scrollY > 30) {
                    topbar.classList.add('visible');
                } else {
                    topbar.classList.remove('visible');
                }
            };

            updateTopbar();
            window.addEventListener('scroll', updateTopbar);
        }
    }

    if (isPositionality) {
        const navLinks = Array.from(document.querySelectorAll('.positionality-sidebar a[href^="#"]'));
        const sections = Array.from(document.querySelectorAll('.positionality-main .positionality-section[id]'));
        let activeSectionId = sections[0]?.id || null;

        const setActiveSection = (sectionId) => {
            navLinks.forEach(link => {
                const isActive = link.getAttribute('href') === `#${sectionId}`;
                link.classList.toggle('is-active', isActive);
                if (isActive) {
                    link.setAttribute('aria-current', 'true');
                } else {
                    link.removeAttribute('aria-current');
                }
            });
        };

        const updateActiveSectionFromScroll = () => {
            if (sections.length === 0) return;

            const topbarHeight = topbar ? topbar.getBoundingClientRect().height : 0;
            const markerY = topbarHeight + window.innerHeight * 0.3;

            let currentSection = sections[0];

            sections.forEach(section => {
                if (section.getBoundingClientRect().top <= markerY) {
                    currentSection = section;
                }
            });

            if (currentSection && currentSection.id !== activeSectionId) {
                activeSectionId = currentSection.id;
                setActiveSection(activeSectionId);
            }
        };

        if (sections.length > 0) {
            activeSectionId = window.location.hash ? window.location.hash.substring(1) : sections[0].id;
            setActiveSection(activeSectionId);
            requestAnimationFrame(updateActiveSectionFromScroll);
        }

        window.addEventListener('scroll', updateActiveSectionFromScroll, { passive: true });
        window.addEventListener('resize', updateActiveSectionFromScroll);

        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    const offset = 86;
                    const targetTop = window.pageYOffset + targetElement.getBoundingClientRect().top - offset;
                    window.scrollTo({
                        top: targetTop,
                        behavior: 'smooth'
                    });
                    history.replaceState(null, '', `#${targetId}`);
                    activeSectionId = targetId;
                    setActiveSection(targetId);
                    requestAnimationFrame(updateActiveSectionFromScroll);
                }
            });
        });
    } else {
        const anchorLinks = document.querySelectorAll('a[href^="#"]');
        anchorLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    const folderCardLinks = document.querySelectorAll('.folder-card');
    folderCardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const destination = link.getAttribute('href');
            document.body.classList.add('page-transition-out');
            setTimeout(() => {
                window.location.href = destination;
            }, 260);
        });
    });
});