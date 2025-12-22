import { __ } from '@wordpress/i18n';
import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
  RichText,
  PanelColorSettings,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  Button,
  ButtonGroup,
  RangeControl,
} from '@wordpress/components';

import './editor.scss';

// Get Pro status from WordPress
const isPro = window.jechangelogData?.isPro || false;

const ALLOWED_BLOCKS = ['jechangelog/changelog-entry'];
const TEMPLATE = [['jechangelog/changelog-entry', {}]];

const THEMES = {
  default: {
    label: 'Default',
    primary: '#4f46e5',
    badges: {
      new: '#10b981',
      fix: '#ef4444',
      improved: '#3b82f6',
      breaking: '#f59e0b',
      deprecated: '#6b7280',
    },
  },
  ocean: {
    label: 'Ocean',
    primary: '#0891b2',
    badges: {
      new: '#06b6d4',
      fix: '#f43f5e',
      improved: '#0ea5e9',
      breaking: '#fb923c',
      deprecated: '#64748b',
    },
  },
  forest: {
    label: 'Forest',
    primary: '#059669',
    badges: {
      new: '#10b981',
      fix: '#dc2626',
      improved: '#0d9488',
      breaking: '#ca8a04',
      deprecated: '#57534e',
    },
  },
  sunset: {
    label: 'Sunset',
    primary: '#dc2626',
    badges: {
      new: '#f97316',
      fix: '#e11d48',
      improved: '#ea580c',
      breaking: '#b91c1c',
      deprecated: '#78716c',
    },
  },
  purple: {
    label: 'Purple',
    primary: '#7c3aed',
    badges: {
      new: '#a855f7',
      fix: '#ec4899',
      improved: '#8b5cf6',
      breaking: '#f472b6',
      deprecated: '#9ca3af',
    },
  },
  minimal: {
    label: 'Minimal',
    primary: '#374151',
    badges: {
      new: '#6b7280',
      fix: '#4b5563',
      improved: '#374151',
      breaking: '#1f2937',
      deprecated: '#9ca3af',
    },
  },
};

export default function Edit({ attributes, setAttributes }) {
  const {
    title,
    showTitle,
    layout,
    theme,
    primaryColor,
    badgeColors,
    collapsible,
    defaultExpanded,
    enableAnchorLinks,
    enableFilter,
    enableShowMore,
    initialCount,
  } = attributes;

  const blockProps = useBlockProps({
    className: `jechangelog jechangelog--${layout}${collapsible ? ' jechangelog--collapsible' : ''}`,
    style: {
      '--je-primary': primaryColor,
      '--je-new': badgeColors.new,
      '--je-fix': badgeColors.fix,
      '--je-improved': badgeColors.improved,
      '--je-breaking': badgeColors.breaking,
      '--je-deprecated': badgeColors.deprecated,
    },
  });

  const applyTheme = (themeName) => {
    if (!isPro && themeName !== 'default') {
      return;
    }
    const selectedTheme = THEMES[themeName];
    setAttributes({
      theme: themeName,
      primaryColor: selectedTheme.primary,
      badgeColors: selectedTheme.badges,
    });
  };

  const updateBadgeColor = (type, color) => {
    if (!isPro) return;
    setAttributes({
      badgeColors: {
        ...badgeColors,
        [type]: color,
      },
    });
  };

  return (
    <>
      <InspectorControls>
        {/* Pro Upsell Panel */}
        {!isPro && (
          <PanelBody title={__('Get Pro Features', 'jechangelog-block')} initialOpen={true}>
            <div style={{ color: '#1e3a5f' }}>
              <p style={{ marginBottom: '12px' }}>{__('Unlock all features:', 'jechangelog-block')}</p>
              <ul style={{ 
                color: '#374151', 
                listStyle: 'disc', 
                paddingLeft: '20px', 
                marginBottom: '16px',
                marginTop: '0'
              }}>
                <li>6 Color Themes</li>
                <li>Custom Primary Color</li>
                <li>Cards & Compact Layouts</li>
                <li>Collapsible Sections</li>
                <li>Anchor Links</li>
                <li>Filter by Type</li>
              </ul>
              <a 
                href="https://jeplugins.github.io/changelog-block/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  textDecoration: 'none',
                  fontSize: '13px'
                }}
              >
                {__('Get Pro Version', 'jechangelog-block')} →
              </a>
            </div>
          </PanelBody>
        )}

        <PanelBody title={__('Settings', 'jechangelog-block')}>
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Show Title', 'jechangelog-block')}
            checked={showTitle}
            onChange={(val) => setAttributes({ showTitle: val })}
          />
          <SelectControl
            __next40pxDefaultSize
            __nextHasNoMarginBottom
            label={__('Layout', 'jechangelog-block')}
            value={layout}
            options={[
              { label: 'Timeline', value: 'timeline' },
              { label: isPro ? 'Cards' : 'Cards (Pro)', value: 'cards' },
              { label: isPro ? 'Compact' : 'Compact (Pro)', value: 'compact' },
            ]}
            onChange={(val) => {
              if (!isPro && (val === 'cards' || val === 'compact')) {
                return;
              }
              setAttributes({ layout: val });
            }}
          />
          
          {/* Pro Features */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Enable Anchor Links', 'jechangelog-block')}
              help={isPro ? __('Add #v1.0.0 links to each version', 'jechangelog-block') : __('Pro Feature', 'jechangelog-block')}
              checked={isPro && enableAnchorLinks}
              onChange={(val) => isPro && setAttributes({ enableAnchorLinks: val })}
              disabled={!isPro}
            />
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Enable Filter', 'jechangelog-block')}
              help={isPro ? __('Show filter buttons by change type', 'jechangelog-block') : __('Pro Feature', 'jechangelog-block')}
              checked={isPro && enableFilter}
              onChange={(val) => isPro && setAttributes({ enableFilter: val })}
              disabled={!isPro}
            />
          </div>
        </PanelBody>

        <PanelBody title={isPro ? __('Show More/Less', 'jechangelog-block') : __('Show More/Less (Pro)', 'jechangelog-block')} initialOpen={false}>
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Enable Show More', 'jechangelog-block')}
            help={isPro ? __('Limit visible entries with a load more button', 'jechangelog-block') : __('Pro Feature', 'jechangelog-block')}
            checked={isPro && enableShowMore}
            onChange={(val) => isPro && setAttributes({ enableShowMore: val })}
            disabled={!isPro}
          />
          {isPro && enableShowMore && (
            <RangeControl
              label={__('Initial entries to show', 'jechangelog-block')}
              value={initialCount}
              onChange={(val) => setAttributes({ initialCount: val })}
              min={1}
              max={10}
            />
          )}
        </PanelBody>

        <PanelBody title={isPro ? __('Accordion', 'jechangelog-block') : __('Accordion (Pro)', 'jechangelog-block')} initialOpen={false}>
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Enable Collapsible', 'jechangelog-block')}
            help={isPro ? __('Allow users to expand/collapse each version', 'jechangelog-block') : __('Pro Feature', 'jechangelog-block')}
            checked={isPro && collapsible}
            onChange={(val) => isPro && setAttributes({ collapsible: val })}
            disabled={!isPro}
          />
          {isPro && collapsible && (
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Default Expanded', 'jechangelog-block')}
              help={__('Show all entries expanded by default', 'jechangelog-block')}
              checked={defaultExpanded}
              onChange={(val) => setAttributes({ defaultExpanded: val })}
            />
          )}
        </PanelBody>

        <PanelBody title={isPro ? __('Color Theme', 'jechangelog-block') : __('Color Theme (Pro)', 'jechangelog-block')} initialOpen={false}>
          <p style={{ marginBottom: '8px', fontWeight: 500 }}>
            {__('Preset Themes', 'jechangelog-block')}
          </p>
          <ButtonGroup style={{ marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
            {Object.entries(THEMES).map(([key, value]) => (
              <Button
                key={key}
                variant={theme === key ? 'primary' : 'secondary'}
                onClick={() => applyTheme(key)}
                disabled={!isPro && key !== 'default'}
                style={{
                  borderColor: value.primary,
                  ...(theme === key && { backgroundColor: value.primary }),
                  ...(!isPro && key !== 'default' && { opacity: 0.5 }),
                }}
              >
                {value.label} {!isPro && key !== 'default' && '(Pro)'}
              </Button>
            ))}
          </ButtonGroup>
        </PanelBody>

        {isPro && (
          <PanelColorSettings
            title={__('Custom Colors', 'jechangelog-block')}
            initialOpen={false}
            colorSettings={[
              {
                value: primaryColor,
                onChange: (color) => setAttributes({ primaryColor: color || '#4f46e5' }),
                label: __('Primary Color', 'jechangelog-block'),
              },
              {
                value: badgeColors.new,
                onChange: (color) => updateBadgeColor('new', color || '#10b981'),
                label: __('New Badge', 'jechangelog-block'),
              },
              {
                value: badgeColors.fix,
                onChange: (color) => updateBadgeColor('fix', color || '#ef4444'),
                label: __('Fix Badge', 'jechangelog-block'),
              },
              {
                value: badgeColors.improved,
                onChange: (color) => updateBadgeColor('improved', color || '#3b82f6'),
                label: __('Improved Badge', 'jechangelog-block'),
              },
              {
                value: badgeColors.breaking,
                onChange: (color) => updateBadgeColor('breaking', color || '#f59e0b'),
                label: __('Breaking Badge', 'jechangelog-block'),
              },
              {
                value: badgeColors.deprecated,
                onChange: (color) => updateBadgeColor('deprecated', color || '#6b7280'),
                label: __('Deprecated Badge', 'jechangelog-block'),
              },
            ]}
          />
        )}
      </InspectorControls>

      <div {...blockProps}>
        {showTitle && (
          <RichText
            tagName="h2"
            className="jechangelog__title"
            value={title}
            onChange={(val) => setAttributes({ title: val })}
            placeholder={__('Changelog', 'jechangelog-block')}
          />
        )}

        {isPro && enableFilter && (
          <div className="jechangelog__filter jechangelog__filter--preview">
            <button className="jechangelog__filter-btn jechangelog__filter-btn--active">All</button>
            <button className="jechangelog__filter-btn">New</button>
            <button className="jechangelog__filter-btn">Fix</button>
            <button className="jechangelog__filter-btn">Improved</button>
          </div>
        )}

        <div className="jechangelog__list">
          <InnerBlocks
            allowedBlocks={ALLOWED_BLOCKS}
            template={TEMPLATE}
            templateLock={false}
          />
        </div>

        {isPro && enableShowMore && (
          <div className="jechangelog__show-more jechangelog__show-more--preview">
            <button className="jechangelog__show-more-btn">
              Show More ({initialCount} entries visible)
            </button>
          </div>
        )}
      </div>
    </>
  );
}