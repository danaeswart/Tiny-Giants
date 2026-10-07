import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';

const VARIANTS = {
  primary:
    'bg-sun text-ink shadow-[0_5px_0_var(--color-sun-deep)] hover:brightness-105 active:translate-y-1 active:shadow-[0_1px_0_var(--color-sun-deep)]',
  secondary:
    'bg-white text-ink ring-2 ring-ink/15 shadow-[0_4px_0_rgb(43_39_51/0.15)] hover:bg-paper active:translate-y-1 active:shadow-none',
};

// Every size is at least 56px tall — comfortably above the 44px touch-target minimum.
const SIZES = {
  md: 'min-h-14 px-6 text-lg',
  lg: 'min-h-16 px-7 text-xl',
  xl: 'min-h-20 px-10 text-2xl',
};

/** Renders a <Link> when `to` is given, otherwise a <button>. */
export default function Button({
  to,
  variant = 'primary',
  size = 'lg',
  icon,
  children,
  className = '',
  ...rest
}) {
  const classes = `inline-flex items-center justify-center gap-3 rounded-full font-extrabold leading-tight transition select-none ${VARIANTS[variant]} ${SIZES[size]} ${className}`;
  const content = (
    <>
      {icon && <Icon name={icon} className="size-[1.25em] shrink-0" />}
      {children && <span>{children}</span>}
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {content}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...rest}>
      {content}
    </button>
  );
}
