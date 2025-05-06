import { FC, useMemo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import ColorCheckbox from '../../shared/ColorCheckbox/ColorCheckbox';
import './ColorPalette.scss';

export const COLOR_PALETTE = 'color-palette';
export const COLOR_PALETTE_COLOR = `${COLOR_PALETTE}_color`;

export type TColorPaletteProps = {
  name: string;
  colorsData: Set<string>;
  checkedColors: Record<string, boolean>;
  onColorChange: (key: string) => void;
} & TIntrinsicDiv;

const ColorPalette: FC<TColorPaletteProps> = (props) => {
  const { className, colorsData, checkedColors, onColorChange, name } = props;
  const classes = classNames(COLOR_PALETTE, className);

  const content = useMemo(() => {
    return [...colorsData].map((value) => {
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
            checked: !!checkedColors[value],
            onChange: () => onColorChange(value),
          }}
        />
      );
    });
  }, [colorsData, checkedColors, name, onColorChange]);

  return <div className={classes}>{content}</div>;
};

export default ColorPalette;
