import React from 'react';

import './styles/index.scss';

export interface SpinnerLoadingProps {
  color?: 'default' | 'primary' | 'white';
  size?: number;
  styles?: React.CSSProperties;
}

const classPrefix = 'xgy-spinner-loading';

const SpinnerLoading: React.FC<SpinnerLoadingProps> = ({
  color = 'default',
  size = 32,
  styles = {},
}) => {
  return (
    <div
      className={`xgy-spinner-loading xgy-spinner-loading-color-${color}`}
      style={{ ...styles, width: size, height: size }}
    />
  );
};

export default SpinnerLoading;

SpinnerLoading.displayName = 'SpinnerLoading';
