import { FC } from 'react';

const SvgSprite: FC = () => {
  return (
    <svg width="0" height="0" style={{ display: 'none' }}>
      <symbol fill="currentColor" id="check" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="m18.6 2.3-12.6 12.6-4.6-4.6-1.4 1.4 6 6 14-14z"></path>
      </symbol>
    </svg>
  );
};

export default SvgSprite;
