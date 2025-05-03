import { FC } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK } from '../../../constants/cssHelpers';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import './LoaderBlock.scss';

export const LOADER_BLOCK = 'loader-block';

export type TLoaderBlockProps = TIntrinsicDiv;

const LoaderBlock: FC<TLoaderBlockProps> = (props) => {
  const { className, ...rest } = props;

  const classes = classNames(BLOCK, LOADER_BLOCK, className);

  return (
    <div {...rest} className={classes}>
      <ScreenLoader type="linear" fullSpace />
    </div>
  );
};

export default LoaderBlock;
