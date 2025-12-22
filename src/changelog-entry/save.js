import { useBlockProps, RichText } from '@wordpress/block-editor';

const TYPE_CONFIG = {
  new: { label: 'New', class: 'new' },
  fix: { label: 'Fix', class: 'fix' },
  improved: { label: 'Improved', class: 'improved' },
  breaking: { label: 'Breaking', class: 'breaking' },
  deprecated: { label: 'Deprecated', class: 'deprecated' },
};

export default function Save({ attributes }) {
  const { version, date, changes } = attributes;

  const blockProps = useBlockProps.save({
    className: 'jechangelog-entry',
  });

  return (
    <div {...blockProps}>
      <div className="jechangelog-entry__header">
        <span className="jechangelog-entry__version">v{version}</span>
        {date && <span className="jechangelog-entry__date">{date}</span>}
      </div>

      {changes.length > 0 && (
        <ul className="jechangelog-entry__changes">
          {changes.map((change, index) => (
            <li key={index} className="jechangelog-entry__change">
              <span
                className={`jechangelog-entry__badge jechangelog-entry__badge--${TYPE_CONFIG[change.type]?.class}`}
              >
                {TYPE_CONFIG[change.type]?.label}
              </span>
              <RichText.Content
                tagName="span"
                className="jechangelog-entry__text"
                value={change.text}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}