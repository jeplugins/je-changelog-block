import { useBlockProps, InnerBlocks, RichText } from '@wordpress/block-editor';

export default function Save({ attributes }) {
  const {
    title,
    showTitle,
    layout,
    primaryColor,
    badgeColors,
    collapsible,
    defaultExpanded,
    enableAnchorLinks,
    enableFilter,
    enableShowMore,
    initialCount,
  } = attributes;

  const blockProps = useBlockProps.save({
    className: `jechangelog jechangelog--${layout}${collapsible ? ' jechangelog--collapsible' : ''}${enableAnchorLinks ? ' jechangelog--has-anchors' : ''}${enableFilter ? ' jechangelog--has-filter' : ''}${enableShowMore ? ' jechangelog--has-show-more' : ''}`,
    style: {
      '--je-primary': primaryColor,
      '--je-new': badgeColors.new,
      '--je-fix': badgeColors.fix,
      '--je-improved': badgeColors.improved,
      '--je-breaking': badgeColors.breaking,
      '--je-deprecated': badgeColors.deprecated,
    },
    'data-collapsible': collapsible,
    'data-default-expanded': defaultExpanded,
    'data-anchor-links': enableAnchorLinks,
    'data-filter': enableFilter,
    'data-show-more': enableShowMore,
    'data-initial-count': initialCount,
  });

  return (
    <div {...blockProps}>
      {showTitle && title && (
        <RichText.Content
          tagName="h2"
          className="jechangelog__title"
          value={title}
        />
      )}

      {enableFilter && <div className="jechangelog__filter"></div>}

      <div className="jechangelog__list">
        <InnerBlocks.Content />
      </div>

      {enableShowMore && <div className="jechangelog__show-more"></div>}
    </div>
  );
}