import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';
import { TextControl, Button, SelectControl } from '@wordpress/components';
import { trash, chevronUp, chevronDown } from '@wordpress/icons';

import './style.scss';

const CHANGE_TYPES = [
  { label: '✨ New', value: 'new' },
  { label: '🔧 Fix', value: 'fix' },
  { label: '⚡ Improved', value: 'improved' },
  { label: '🔥 Breaking', value: 'breaking' },
  { label: '🗑️ Deprecated', value: 'deprecated' },
];

export default function Edit({ attributes, setAttributes }) {
  const { version, date, changes } = attributes;

  const blockProps = useBlockProps({
    className: 'jechangelog-entry',
  });

  const addChange = () => {
    setAttributes({
      changes: [...changes, { type: 'new', text: '' }],
    });
  };

  const updateChange = (index, field, value) => {
    const updated = [...changes];
    updated[index] = { ...updated[index], [field]: value };
    setAttributes({ changes: updated });
  };

  const removeChange = (index) => {
    setAttributes({
      changes: changes.filter((_, i) => i !== index),
    });
  };

  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...changes];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setAttributes({ changes: updated });
  };

  const moveDown = (index) => {
    if (index === changes.length - 1) return;
    const updated = [...changes];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setAttributes({ changes: updated });
  };

  return (
    <div {...blockProps}>
      <div className="jechangelog-entry__header">
        <TextControl
          __next40pxDefaultSize
          __nextHasNoMarginBottom
          label={__('Version', 'jechangelog-block')}
          value={version}
          onChange={(val) => setAttributes({ version: val })}
          placeholder="1.0.0"
        />
        <TextControl
          __next40pxDefaultSize
          __nextHasNoMarginBottom
          label={__('Date', 'jechangelog-block')}
          value={date}
          onChange={(val) => setAttributes({ date: val })}
          placeholder="2024-12-10"
          type="date"
        />
      </div>

      <div className="jechangelog-entry__changes">
        {changes.map((change, index) => (
          <div 
            key={index} 
            className="jechangelog-entry__change"
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '8px',
              width: '100%',
            }}
          >
            <SelectControl
              __next40pxDefaultSize
              __nextHasNoMarginBottom
              value={change.type}
              options={CHANGE_TYPES}
              onChange={(val) => updateChange(index, 'type', val)}
              style={{ flex: '0 0 140px', width: '140px' }}
            />
            <div 
              className="jechangelog-entry__change-text"
              style={{
                flex: '1 1 auto',
                minWidth: 0,
                minHeight: '40px',
                display: 'flex',
                alignItems: 'center',
                background: '#ffffff',
                border: '1px solid #949494',
                borderRadius: '4px',
                padding: '0 12px',
              }}
            >
              <RichText
                tagName="span"
                value={change.text}
                onChange={(val) => updateChange(index, 'text', val)}
                placeholder={__('Describe the change...', 'jechangelog-block')}
                allowedFormats={[
                  'core/bold',
                  'core/italic',
                  'core/link',
                  'core/code',
                  'core/strikethrough',
                ]}
                style={{ 
                  width: '100%',
                  minHeight: '24px',
                  lineHeight: '1.5',
                  outline: 'none',
                }}
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Button
                icon={chevronUp}
                size="small"
                onClick={() => moveUp(index)}
                disabled={index === 0}
                label="Move up"
                style={{ 
                  width: '24px', 
                  height: '20px', 
                  minWidth: '24px',
                  padding: 0,
                  opacity: index === 0 ? 0.3 : 1,
                }}
              />
              <Button
                icon={chevronDown}
                size="small"
                onClick={() => moveDown(index)}
                disabled={index === changes.length - 1}
                label="Move down"
                style={{ 
                  width: '24px', 
                  height: '20px', 
                  minWidth: '24px',
                  padding: 0,
                  opacity: index === changes.length - 1 ? 0.3 : 1,
                }}
              />
            </div>

            <Button
              icon={trash}
              isDestructive
              onClick={() => removeChange(index)}
              label="Remove"
              style={{ flex: '0 0 36px', width: '36px', height: '36px' }}
            />
          </div>
        ))}

        <Button variant="secondary" onClick={addChange}>
          {__('+ Add Change', 'jechangelog-block')}
        </Button>
      </div>
    </div>
  );
}