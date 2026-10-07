import Button, { BUTTON_SIZES } from './Button.jsx';

/** Round icon-only button. `label` is required: it's what screen readers announce. */
export default function IconButton({ icon, label, size = 'lg', variant = 'secondary', style, ...rest }) {
  const d = BUTTON_SIZES[size].height;
  return (
    <Button
      icon={icon}
      size={size}
      variant={variant}
      accessibilityLabel={label}
      style={[{ width: d, height: d }, style]}
      {...rest}
    />
  );
}
