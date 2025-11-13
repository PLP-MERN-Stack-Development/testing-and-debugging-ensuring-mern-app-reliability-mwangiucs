import React from 'react';

function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  children,
  ...rest
}) {
  const classes = [
    `btn-${variant}`,
    `btn-${size}`,
    disabled ? 'btn-disabled' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      className={classes}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
