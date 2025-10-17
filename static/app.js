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

    const tagsContainer = $('#tags-container');
    const tagsInputField = $('#tags-input-field');
    const tagsInput = $('#tags-input');

    let tags = [];

    const pastelColors = [
        'var(--pastel-blue)',
        'var(--pastel-green)',
        'var(--pastel-pink)',
        'var(--pastel-yellow)',
        'var(--pastel-purple)'
    ];

    function addTag(tag) {
        if (tag && !tags.includes(tag)) {
            tags.push(tag);
            const chip = $('<div class="tag-chip"></div>');
            const chipText = $('<p class="chip-text"></p>').text(tag);
            chip.append(chipText);
            chip.css('borderColor', pastelColors[tags.length % pastelColors.length]);
            const removeChip = $('<span class="remove-chip">&times;</span>');
            removeChip.on('click', function() {
                const tagToRemove = $(this).siblings('.chip-text').text();
                tags = tags.filter(t => t !== tagToRemove);
                $(this).parent().remove();
                updateHiddenInput();
            });
            chip.append(removeChip);
            tagsContainer.append(chip);
            updateHiddenInput();
        }
    }

    function updateHiddenInput() {
        tagsInput.val(tags.join(','));
    }

    tagsInputField.on('keyup', function(e) {
        if (e.key === ',' || e.key === 'Enter') {
            let tag = $(this).val().trim();
            if (e.key === ',') {
                tag = tag.slice(0, -1);
            }
            addTag(tag);
            $(this).val('');
        }
    });
});