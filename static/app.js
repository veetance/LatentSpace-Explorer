$(document).ready(function() {
    const buttons = $('.btn');
    let glow = null;

    buttons.on('mouseenter', function(e) {
        // Create the glow element only if it doesn't exist
        if (!glow) {
            glow = $('<span>').addClass('glow');
            $(this).append(glow);
        }
    });

    buttons.on('mousemove', function(e) {
        if (glow) {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Use requestAnimationFrame for smoother animation
            requestAnimationFrame(() => {
                glow.css({
                    left: `${x}px`,
                    top: `${y}px`
                });
            });
        }
    });

    buttons.on('mouseleave', function(e) {
        // Remove the glow element when the mouse leaves
        if (glow) {
            glow.remove();
            glow = null;
        }
    });

    buttons.on('click', function(e) {
        if (glow) {
            // Clone the glow to create the ripple, so the hover effect can remain
            const ripple = glow.clone();
            ripple.addClass('rippling');
            $(this).append(ripple);

            // Remove the ripple after the animation
            setTimeout(() => {
                ripple.remove();
            }, 600); // Match animation duration
        }
    });
});