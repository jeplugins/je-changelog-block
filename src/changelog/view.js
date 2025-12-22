document.addEventListener('DOMContentLoaded', function () {
  const changelogs = document.querySelectorAll('.jechangelog');

  // Fallback copy function
  const copyToClipboard = (text) => {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    } else {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      textArea.style.top = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      return new Promise((resolve, reject) => {
        try {
          document.execCommand('copy');
          resolve();
        } catch (err) {
          reject(err);
        } finally {
          textArea.remove();
        }
      });
    }
  };

  changelogs.forEach((changelog) => {
    const isCollapsible = changelog.dataset.collapsible === 'true';
    const defaultExpanded = changelog.dataset.defaultExpanded === 'true';
    const hasAnchorLinks = changelog.dataset.anchorLinks === 'true';
    const hasFilter = changelog.dataset.filter === 'true';
    const hasShowMore = changelog.dataset.showMore === 'true';
    const initialCount = parseInt(changelog.dataset.initialCount) || 3;

    const entries = changelog.querySelectorAll('.jechangelog-entry');
    const filterContainer = changelog.querySelector('.jechangelog__filter');
    const showMoreContainer = changelog.querySelector('.jechangelog__show-more');

    // Track states
    let showMoreExpanded = false;
    let showMoreBtn = null;
    let currentFilter = 'all';

    // Helper function to get entries that have changes matching a filter type
    const getFilteredEntries = (type) => {
      if (type === 'all') {
        return Array.from(entries);
      }
      
      return Array.from(entries).filter((entry) => {
        const changes = entry.querySelectorAll('.jechangelog-entry__change');
        let hasMatchingChange = false;
        
        changes.forEach((change) => {
          const badge = change.querySelector('.jechangelog-entry__badge');
          if (badge && badge.classList.contains(`jechangelog-entry__badge--${type}`)) {
            hasMatchingChange = true;
          }
        });
        
        return hasMatchingChange;
      });
    };

    // Helper function to update Show More button visibility and state
    const updateShowMore = (filteredEntries) => {
      if (!hasShowMore || !showMoreContainer || !showMoreBtn) return;

      const filteredCount = filteredEntries.length;
      const hiddenCount = filteredCount - initialCount;

      if (filteredCount > initialCount) {
        // Show the Show More button
        showMoreContainer.style.display = '';
        
        // Update button text with correct count
        if (!showMoreExpanded) {
          showMoreBtn.innerHTML = `
            <span class="jechangelog__show-more-text">Show ${hiddenCount} More</span>
            <svg class="jechangelog__show-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          `;
        }
      } else {
        // Hide the Show More button
        showMoreContainer.style.display = 'none';
      }
    };

    // Helper function to apply Show More visibility to filtered entries
    const applyShowMoreToFilteredEntries = (filteredEntries) => {
      if (!hasShowMore) return;

      // First, hide all entries
      entries.forEach((entry) => {
        entry.classList.add('jechangelog-entry--hidden');
        entry.classList.remove('jechangelog-entry--visible');
      });

      // Then show filtered entries based on Show More state
      filteredEntries.forEach((entry, index) => {
        if (showMoreExpanded || index < initialCount) {
          entry.classList.remove('jechangelog-entry--hidden');
          entry.classList.add('jechangelog-entry--visible');
        } else {
          entry.classList.add('jechangelog-entry--hidden');
          entry.classList.remove('jechangelog-entry--visible');
        }
      });
    };

    // Show More/Less functionality
    if (hasShowMore && showMoreContainer && entries.length > initialCount) {
      const totalEntries = entries.length;
      const hiddenCount = totalEntries - initialCount;

      // Initially hide entries beyond initialCount
      entries.forEach((entry, index) => {
        if (index >= initialCount) {
          entry.classList.add('jechangelog-entry--hidden');
        }
      });

      // Create Show More button
      showMoreBtn = document.createElement('button');
      showMoreBtn.className = 'jechangelog__show-more-btn';
      showMoreBtn.innerHTML = `
        <span class="jechangelog__show-more-text">Show ${hiddenCount} More</span>
        <svg class="jechangelog__show-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      `;
      showMoreContainer.appendChild(showMoreBtn);

      showMoreBtn.addEventListener('click', () => {
        showMoreExpanded = !showMoreExpanded;

        // Get current filtered entries
        const filteredEntries = getFilteredEntries(currentFilter);
        const filteredHiddenCount = filteredEntries.length - initialCount;

        // Apply visibility to filtered entries
        applyShowMoreToFilteredEntries(filteredEntries);

        // Also need to re-apply the filter display for changes within entries
        if (currentFilter !== 'all') {
          filteredEntries.forEach((entry) => {
            const changes = entry.querySelectorAll('.jechangelog-entry__change');
            changes.forEach((change) => {
              const badge = change.querySelector('.jechangelog-entry__badge');
              if (badge && badge.classList.contains(`jechangelog-entry__badge--${currentFilter}`)) {
                change.style.display = '';
              } else {
                change.style.display = 'none';
              }
            });
          });
        }

        if (showMoreExpanded) {
          showMoreBtn.classList.add('jechangelog__show-more-btn--expanded');
          showMoreBtn.innerHTML = `
            <span class="jechangelog__show-more-text">Show Less</span>
            <svg class="jechangelog__show-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          `;
        } else {
          showMoreBtn.classList.remove('jechangelog__show-more-btn--expanded');
          showMoreBtn.innerHTML = `
            <span class="jechangelog__show-more-text">Show ${filteredHiddenCount} More</span>
            <svg class="jechangelog__show-more-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          `;

          // Scroll to top of changelog
          changelog.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    }

    // Filter functionality
    if (hasFilter && filterContainer) {
      const types = ['all', 'new', 'fix', 'improved', 'breaking', 'deprecated'];
      const typeLabels = {
        all: 'All',
        new: 'New',
        fix: 'Fix',
        improved: 'Improved',
        breaking: 'Breaking',
        deprecated: 'Deprecated',
      };

      const counts = { all: 0 };
      types.slice(1).forEach((type) => (counts[type] = 0));

      entries.forEach((entry) => {
        const changes = entry.querySelectorAll('.jechangelog-entry__change');
        changes.forEach((change) => {
          const badge = change.querySelector('.jechangelog-entry__badge');
          if (badge) {
            types.slice(1).forEach((type) => {
              if (badge.classList.contains(`jechangelog-entry__badge--${type}`)) {
                counts[type]++;
                counts.all++;
              }
            });
          }
        });
      });

      types.forEach((type) => {
        if (type !== 'all' && counts[type] === 0) return;

        const btn = document.createElement('button');
        btn.className = `jechangelog__filter-btn jechangelog__filter-btn--${type}`;
        if (type === 'all') btn.classList.add('jechangelog__filter-btn--active');
        btn.setAttribute('data-filter', type);
        btn.innerHTML = `${typeLabels[type]} <span class="jechangelog__filter-count">${counts[type]}</span>`;
        filterContainer.appendChild(btn);

        btn.addEventListener('click', () => {
          filterContainer.querySelectorAll('.jechangelog__filter-btn').forEach((b) => {
            b.classList.remove('jechangelog__filter-btn--active');
          });
          btn.classList.add('jechangelog__filter-btn--active');
          
          currentFilter = type;
          
          // Reset Show More expanded state when changing filter
          showMoreExpanded = false;
          if (showMoreBtn) {
            showMoreBtn.classList.remove('jechangelog__show-more-btn--expanded');
          }

          // Get filtered entries
          const filteredEntries = getFilteredEntries(type);

          // Update Show More button visibility
          updateShowMore(filteredEntries);

          // Apply filter to changes within entries
          entries.forEach((entry) => {
            const changes = entry.querySelectorAll('.jechangelog-entry__change');
            let visibleCount = 0;

            changes.forEach((change) => {
              const badge = change.querySelector('.jechangelog-entry__badge');
              if (type === 'all') {
                change.style.display = '';
                visibleCount++;
              } else if (badge && badge.classList.contains(`jechangelog-entry__badge--${type}`)) {
                change.style.display = '';
                visibleCount++;
              } else {
                change.style.display = 'none';
              }
            });

            // Hide entry if no matching changes
            if (type !== 'all' && visibleCount === 0) {
              entry.style.display = 'none';
              entry.classList.add('jechangelog-entry--hidden');
              entry.classList.remove('jechangelog-entry--visible');
            } else {
              entry.style.display = '';
            }
          });

          // Apply Show More logic to filtered entries
          if (hasShowMore && showMoreContainer) {
            applyShowMoreToFilteredEntries(filteredEntries);
          }
        });
      });
    }

    entries.forEach((entry) => {
      const header = entry.querySelector('.jechangelog-entry__header');
      const changes = entry.querySelector('.jechangelog-entry__changes');
      const versionEl = entry.querySelector('.jechangelog-entry__version');

      if (!header || !versionEl) return;

      const version = versionEl.textContent.trim().replace(/^v/, '');
      const anchorId = `v${version}`;

      // Anchor link functionality
      if (hasAnchorLinks) {
        entry.id = anchorId;
        entry.classList.add('jechangelog-entry--has-anchor');

        const copyBtn = document.createElement('button');
        copyBtn.className = 'jechangelog-entry__copy-link';
        copyBtn.setAttribute('aria-label', 'Copy link to this version');
        copyBtn.innerHTML = `
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
        `;

        const toggle = header.querySelector('.jechangelog-entry__toggle');
        if (toggle) {
          header.insertBefore(copyBtn, toggle);
        } else {
          header.appendChild(copyBtn);
        }

        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();

          const url = `${window.location.href.split('#')[0]}#${anchorId}`;

          copyToClipboard(url)
            .then(() => {
              copyBtn.classList.add('jechangelog-entry__copy-link--copied');
              copyBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              `;

              setTimeout(() => {
                copyBtn.classList.remove('jechangelog-entry__copy-link--copied');
                copyBtn.innerHTML = `
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                  </svg>
                `;
              }, 2000);
            })
            .catch((err) => {
              console.error('Copy failed:', err);
            });
        });
      }

      // Collapsible functionality
      if (isCollapsible && changes) {
        entry.classList.add('jechangelog-entry--collapsible');

        if (defaultExpanded) {
          entry.classList.add('jechangelog-entry--expanded');
        } else {
          entry.classList.add('jechangelog-entry--collapsed');
        }

        const toggleIcon = document.createElement('span');
        toggleIcon.className = 'jechangelog-entry__toggle';
        toggleIcon.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        `;
        header.appendChild(toggleIcon);

        header.style.cursor = 'pointer';
        header.setAttribute('role', 'button');
        header.setAttribute('tabindex', '0');
        header.setAttribute('aria-expanded', defaultExpanded ? 'true' : 'false');

        const toggleEntry = () => {
          const isExpanded = entry.classList.contains('jechangelog-entry--expanded');

          if (isExpanded) {
            entry.classList.remove('jechangelog-entry--expanded');
            entry.classList.add('jechangelog-entry--collapsed');
            header.setAttribute('aria-expanded', 'false');
          } else {
            entry.classList.remove('jechangelog-entry--collapsed');
            entry.classList.add('jechangelog-entry--expanded');
            header.setAttribute('aria-expanded', 'true');
          }
        };

        header.addEventListener('click', (e) => {
          if (e.target.closest('.jechangelog-entry__copy-link')) return;
          toggleEntry();
        });

        header.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleEntry();
          }
        });
      }
    });

    // Scroll to anchor on page load
    if (hasAnchorLinks && window.location.hash) {
      const targetId = window.location.hash.slice(1);
      const targetEntry = document.getElementById(targetId);

      if (targetEntry) {
        // Show hidden entry if using Show More
        if (targetEntry.classList.contains('jechangelog-entry--hidden')) {
          targetEntry.classList.remove('jechangelog-entry--hidden');
          targetEntry.classList.add('jechangelog-entry--visible');
        }

        if (targetEntry.classList.contains('jechangelog-entry--collapsed')) {
          targetEntry.classList.remove('jechangelog-entry--collapsed');
          targetEntry.classList.add('jechangelog-entry--expanded');
          const header = targetEntry.querySelector('.jechangelog-entry__header');
          if (header) header.setAttribute('aria-expanded', 'true');
        }

        setTimeout(() => {
          targetEntry.scrollIntoView({ behavior: 'smooth', block: 'start' });
          targetEntry.classList.add('jechangelog-entry--highlighted');

          setTimeout(() => {
            targetEntry.classList.remove('jechangelog-entry--highlighted');
          }, 2000);
        }, 100);
      }
    }
  });
});