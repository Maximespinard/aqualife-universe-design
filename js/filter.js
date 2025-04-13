// Add this JavaScript to the end of your document or in a separate file
document.addEventListener('DOMContentLoaded', function () {
  // Filter tabs functionality
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterPanels = document.querySelectorAll('.filter-panel');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and panels
      filterTabs.forEach((t) => t.classList.remove('active'));
      filterPanels.forEach((p) => p.classList.remove('active'));

      // Add active class to clicked tab
      tab.classList.add('active');

      // Show corresponding panel
      const filterType = tab.getAttribute('data-filter');
      document.getElementById(`${filterType}-panel`).classList.add('active');
    });
  });

  // Size options selection
  const sizeOptions = document.querySelectorAll('.size-option');
  sizeOptions.forEach((option) => {
    option.addEventListener('click', () => {
      option.classList.toggle('active');
      updateActiveFilters();
      updateResultCount('size');
    });
  });

  // Filter chips selection
  const filterChips = document.querySelectorAll('.filter-chip');
  filterChips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('active');
      updateActiveFilters();

      // Get the filter type from the data attribute or parent
      const filterType = chip.dataset.temperament
        ? 'temperament'
        : chip.dataset.care
        ? 'care'
        : chip.dataset.origin
        ? 'origin'
        : chip.dataset.biotope
        ? 'biotope'
        : '';

      if (filterType) {
        updateResultCount(filterType);
      }
    });
  });

  // Update active filters panel
  function updateActiveFilters() {
    const activeFiltersPanel = document.getElementById('active-filters');
    const filterTags = document.getElementById('filter-tags');

    // Clear existing tags
    filterTags.innerHTML = '';

    // Get all active filter options
    const activeSize = document.querySelectorAll('.size-option.active');
    const activeChips = document.querySelectorAll('.filter-chip.active');

    const hasActiveFilters = activeSize.length > 0 || activeChips.length > 0;

    if (hasActiveFilters) {
      activeFiltersPanel.classList.add('show');

      // Add size tags
      activeSize.forEach((option) => {
        const size = option.getAttribute('data-size');
        const name = option.querySelector('.size-name').textContent;

        addFilterTag(size, 'size', name, 'ruler');
      });

      // Add other filter tags
      activeChips.forEach((chip) => {
        let type, value, icon;

        if (chip.dataset.temperament) {
          type = 'temperament';
          value = chip.dataset.temperament;
          icon = chip.querySelector('i').classList[1].replace('fa-', '');
        } else if (chip.dataset.care) {
          type = 'care';
          value = chip.dataset.care;
          icon = chip.querySelector('i').classList[1].replace('fa-', '');
        } else if (chip.dataset.origin) {
          type = 'origin';
          value = chip.dataset.origin;
          icon = chip.querySelector('i').classList[1].replace('fa-', '');
        } else if (chip.dataset.biotope) {
          type = 'biotope';
          value = chip.dataset.biotope;
          icon = chip.querySelector('i').classList[1].replace('fa-', '');
        }

        if (type && value) {
          addFilterTag(
            value,
            type,
            chip.querySelector('span').textContent,
            icon
          );
        }
      });
    } else {
      activeFiltersPanel.classList.remove('show');
    }
  }

  // Add a filter tag to the active filters area
  function addFilterTag(value, type, name, icon) {
    const filterTags = document.getElementById('filter-tags');

    const tag = document.createElement('div');
    tag.className = 'filter-tag';
    tag.setAttribute('data-value', value);
    tag.setAttribute('data-type', type);

    tag.innerHTML = `
      <i class="fas fa-${icon}"></i>
      <span>${name}</span>
      <button data-value="${value}" data-type="${type}">
        <i class="fas fa-times"></i>
      </button>
    `;

    // Add click handler for the remove button
    tag.querySelector('button').addEventListener('click', (e) => {
      const value = e.currentTarget.getAttribute('data-value');
      const type = e.currentTarget.getAttribute('data-type');

      // Remove the filter from the appropriate options
      if (type === 'size') {
        document
          .querySelector(`.size-option[data-size="${value}"]`)
          .classList.remove('active');
      } else {
        document
          .querySelector(`.filter-chip[data-${type}="${value}"]`)
          .classList.remove('active');
      }

      // Update the filters panel
      updateActiveFilters();
      updateResultCount(type);
    });

    filterTags.appendChild(tag);
  }

  // Clear all filters button
  document.getElementById('clear-all-filters').addEventListener('click', () => {
    // Clear all active filters
    document
      .querySelectorAll('.size-option.active, .filter-chip.active')
      .forEach((el) => {
        el.classList.remove('active');
      });

    // Update the UI
    updateActiveFilters();

    // Reset all counts to original values
    document.getElementById('size-count').textContent = '42';
    document.getElementById('temperament-count').textContent = '36';
    document.getElementById('care-count').textContent = '28';
    document.getElementById('origin-count').textContent = '31';
    document.getElementById('biotope-count').textContent = '24';

    // Remove animation classes
    document.querySelectorAll('.count-badge').forEach((badge) => {
      badge.classList.remove('count-animate');
    });
  });

  // Update result count based on filter selections
  function updateResultCount(type) {
    // Get the current count element
    const countEl = document.getElementById(`${type}-count`);
    const countBadge = countEl.closest('.count-badge');

    // Get the current active filters of this type
    const activeFilters =
      type === 'size'
        ? document.querySelectorAll(`.size-option.active`).length
        : document.querySelectorAll(`.filter-chip[data-${type}].active`).length;

    // Base counts
    const baseCounts = {
      size: 42,
      temperament: 36,
      care: 28,
      origin: 31,
      biotope: 24,
    };

    // Calculate new count (fewer results with more filters)
    let newCount;
    if (activeFilters === 0) {
      newCount = baseCounts[type];
    } else {
      // Reduce count by approximately 30% per filter, with randomness
      const reduction = baseCounts[type] * 0.3 * activeFilters;
      newCount = Math.max(
        3,
        Math.round(baseCounts[type] - reduction + (Math.random() * 5 - 2.5))
      );
    }

    // Animate the count change
    countBadge.classList.add('count-animate');
    setTimeout(() => {
      countBadge.classList.remove('count-animate');
    }, 500);

    // Update the displayed count
    countEl.textContent = newCount;
  }
});
