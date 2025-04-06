document.addEventListener('DOMContentLoaded', () => {
    const circle = document.getElementById('circle');
    const volumeIcon = document.getElementById('volume-icon');
    const volumePercentage = document.getElementById('volume-percentage');
    let isMouseDown = false;
    let clickStartTime = 0;
    let lastClickTime = 0;
    let currentSize = 50;
    let animationId = null;
    let shrinkIntervalId = null;
    
    // Minimum and maximum circle sizes for percentage calculation
    const minSize = 50;
    const maxSize = 200; // Assuming this is the maximum size the circle can grow to
    
    // Initial volume percentage display
    updateVolumePercentage();

    // Handle mouse down event
    circle.addEventListener('mousedown', (e) => {
        isMouseDown = true;
        clickStartTime = Date.now();
        
        // Clear any existing shrink interval
        if (shrinkIntervalId) {
            clearInterval(shrinkIntervalId);
            shrinkIntervalId = null;
        }
        
        // Cancel any animation frame
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
        
        // Start expanding the circle
        expandCircle();
    });

    // Handle mouse up event
    document.addEventListener('mouseup', () => {
        if (isMouseDown) {
            isMouseDown = false;
            
            // Calculate time between clicks for expansion rate adjustment
            const now = Date.now();
            const timeBetweenClicks = lastClickTime ? now - lastClickTime : 0;
            lastClickTime = now;
            
            // Cancel the expansion animation
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
            
            // Start shrinking if mouse is up
            startShrinking();
        }
    });

    // Function to expand the circle during mousedown
    function expandCircle() {
        if (!isMouseDown) return;
        
        const clickDuration = Date.now() - clickStartTime;
        
        // Calculate new size based on click duration
        // The longer the click, the more it expands
        const expansionRate = 0.05; // pixels per millisecond
        currentSize = 50 + (clickDuration * expansionRate);
        
        // Apply the new size to both circle and image
        circle.style.width = `${currentSize}px`;
        circle.style.height = `${currentSize}px`;
        volumeIcon.style.width = `${currentSize}px`;
        volumeIcon.style.height = `${currentSize}px`;
        
        // Update volume percentage display
        updateVolumePercentage();
        
        // Continue animation
        animationId = requestAnimationFrame(expandCircle);
    }

    // Function to start shrinking the circle
    function startShrinking() {
        // Start a continuous shrinking effect
        shrinkIntervalId = setInterval(() => {
            // Calculate shrink amount based on time since last click
            const timeSinceLastClick = Date.now() - lastClickTime;
            const shrinkRate = 0.01; // pixels per millisecond
            const shrinkAmount = timeSinceLastClick * shrinkRate * 0.1;
            
            // Shrink the circle and image
            currentSize = Math.max(50, currentSize - shrinkAmount);
            
            // Apply the new size to both circle and image
            circle.style.width = `${currentSize}px`;
            circle.style.height = `${currentSize}px`;
            volumeIcon.style.width = `${currentSize}px`;
            volumeIcon.style.height = `${currentSize}px`;
            
            // Update volume percentage display
            updateVolumePercentage();
            
            // Stop shrinking if we reach minimum size
            if (currentSize <= 50) {
                clearInterval(shrinkIntervalId);
                shrinkIntervalId = null;
            }
        }, 50); // Update every 50ms
    }
    
    // Function to update the volume percentage display
    function updateVolumePercentage() {
        // Calculate volume percentage based on current size
        const percentage = Math.round(((currentSize - minSize) / (maxSize - minSize)) * 100);
        
        // Display special message when over 100%
        if (percentage > 100) {
            volumePercentage.textContent = "now, you have escaped the matrix";
        } else {
            // Normal percentage display
            const clampedPercentage = Math.max(0, percentage);
            volumePercentage.textContent = `${clampedPercentage}%`;
        }
    }
});
