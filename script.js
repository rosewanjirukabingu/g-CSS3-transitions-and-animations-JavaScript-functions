document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const animationToggle = document.getElementById('animation-toggle');
    const themeToggle = document.getElementById('theme-toggle');
    const accentColor = document.getElementById('accent-color');
    const animateBtn = document.getElementById('animate-btn');
    const animatedBox = document.getElementById('animated-box');
    const animatedImg = document.getElementById('animated-img');
    
    // Load preferences from localStorage
    loadPreferences();
    
    // Event listeners
    animationToggle.addEventListener('change', toggleAnimations);
    themeToggle.addEventListener('change', toggleTheme);
    accentColor.addEventListener('input', updateAccentColor);
    animateBtn.addEventListener('click', triggerAnimations);
    
    // Initialize animations based on preferences
    updateAnimationState();
    
    // Function to load saved preferences
    function loadPreferences() {
        if (localStorage.getItem('animationsEnabled') !== null) {
            animationToggle.checked = localStorage.getItem('animationsEnabled') === 'true';
        }
        
        if (localStorage.getItem('darkModeEnabled') !== null) {
            themeToggle.checked = localStorage.getItem('darkModeEnabled') === 'true';
            document.body.classList.toggle('dark-mode', themeToggle.checked);
        }
        
        if (localStorage.getItem('accentColor')) {
            const savedColor = localStorage.getItem('accentColor');
            accentColor.value = savedColor;
            applyAccentColor(savedColor);
        }
    }
    
    // Function to toggle animations
    function toggleAnimations() {
        localStorage.setItem('animationsEnabled', animationToggle.checked);
        updateAnimationState();
    }
    
    // Function to update animation state based on preference
    function updateAnimationState() {
        if (!animationToggle.checked) {
            animatedBox.classList.remove('active');
            animatedImg.classList.remove('active');
        }
    }
    
    // Function to toggle dark mode
    function toggleTheme() {
        const darkModeEnabled = themeToggle.checked;
        document.body.classList.toggle('dark-mode', darkModeEnabled);
        localStorage.setItem('darkModeEnabled', darkModeEnabled);
    }
    
    // Function to update accent color
    function updateAccentColor() {
        const color = accentColor.value;
        applyAccentColor(color);
        localStorage.setItem('accentColor', color);
    }
    
    // Apply accent color to elements
    function applyAccentColor(color) {
        document.documentElement.style.setProperty('--accent-color', color);
        animatedBox.style.backgroundColor = color;
        animateBtn.style.backgroundColor = color;
        
        // Update pulse animation with new color
        const styleSheet = document.styleSheets[0];
        const rules = styleSheet.cssRules || styleSheet.rules;
        
        for (let i = 0; i < rules.length; i++) {
            if (rules[i].name === 'pulse') {
                const keyframes = rules[i];
                keyframes.deleteRule('0%');
                keyframes.deleteRule('70%');
                keyframes.deleteRule('100%');
                
                const colorRgb = hexToRgb(color);
                const shadowColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0.7)`;
                const transparentColor = `rgba(${colorRgb.r}, ${colorRgb.g}, ${colorRgb.b}, 0)`;
                
                keyframes.appendRule(`0% { box-shadow: 0 0 0 0 ${shadowColor}; }`);
                keyframes.appendRule(`70% { box-shadow: 0 0 0 15px ${transparentColor}; }`);
                keyframes.appendRule(`100% { box-shadow: 0 0 0 0 ${transparentColor}; }`);
                break;
            }
        }
    }
    
    // Helper function to convert hex to RGB
    function hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        
        // Parse r, g, b values
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        
        return { r, g, b };
    }
    
    // Function to trigger animations on button click
    function triggerAnimations() {
        if (!animationToggle.checked) return;
        
        // Toggle box animation
        animatedBox.classList.toggle('active');
        
        // Toggle image animation
        animatedImg.classList.toggle('active');
        
        // Add button click effect
        animateBtn.classList.add('clicked');
        setTimeout(() => {
            animateBtn.classList.remove('clicked');
        }, 300);
    }
});