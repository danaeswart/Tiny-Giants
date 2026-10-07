import Button from './Button.jsx';

const SQUARE = {
  md: 'size-14',
  lg: 'size-16',
  xl: 'size-20',
};

/** Round icon-only button. `label` is required: it's the accessible name. */
export default function IconButton({ icon, label, size = 'lg', variant = 'secondary', className = '', ...rest }) {
  return (
    <Button
      icon={icon}
      size={size}
      variant={variant}
      aria-label={label}
      title={label}
      className={`shrink-0 px-0! ${SQUARE[size]} ${className}`}
      {...rest}
    />
  );
}
