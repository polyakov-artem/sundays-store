import { FC, useMemo } from 'react';
import classNames from 'classnames';
import ColorCheckbox from '../../shared/ColorCheckbox/ColorCheckbox';
import { TCheckboxListProps } from '../CheckboxList/CheckboxList';
import './ColorPalette.scss';

export const COLOR_PALETTE = 'color-palette';
export const COLOR_PALETTE_COLOR = `${COLOR_PALETTE}__color`;

export type TColorPaletteProps = TCheckboxListProps;

const ColorPalette: FC<TColorPaletteProps> = (props) => {
  const { className, state, onStateChange, name } = props;
  const classes = classNames(COLOR_PALETTE, className);

  const content = useMemo(() => {
    return Object.entries(state).map(([value, checked]) => {
      const [title, color] = value.split(':#');

      return (
        <ColorCheckbox
          className={COLOR_PALETTE_COLOR}
          key={value}
          color={`#${color}`}
          title={title}
          controlProps={{
            name,
            value,
            checked,
            onChange: onStateChange,
          }}
        />
      );
    });
  }, [state, name, onStateChange]);

  return <div className={classes}>{content}</div>;
};

export default ColorPalette;
