import nioraMark from '../assets/niora-mark.png';
import nioraWordmark from '../assets/niora-wordmark.png';
import './Logo.css';

/**
 * NIORA Logo component.
 *
 * Variants:
 *  - "mark"      → just the N icon
 *  - "wordmark"  → just the NIORA text logo
 *  - "stack"     → mark on top of wordmark (vertical, used in big hero positions)
 *  - "inline"    → mark next to wordmark (horizontal, used in nav, footer)
 *
 * Sizes:
 *  - "sm" | "md" | "lg" | "xl"
 *
 * Tone:
 *  - "auto" (default) follows surrounding background — assets are cream so they
 *    work on dark backgrounds out of the box.
 *  - "dark" inverts the cream to deep green using a CSS filter (use on light pages).
 */
const Logo = ({
  variant = 'inline',
  size = 'md',
  tone = 'auto',
  className = '',
  ...rest
}) => {
  const cls = [
    'logo',
    `logo--${variant}`,
    `logo--${size}`,
    `logo--tone-${tone}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <span className={cls} {...rest}>
      {(variant === 'mark' || variant === 'stack' || variant === 'inline') && (
        <img src={nioraMark} alt={variant === 'mark' ? 'NIORA' : ''} className="logo__mark" />
      )}
      {(variant === 'wordmark' || variant === 'stack' || variant === 'inline') && (
        <img
          src={nioraWordmark}
          alt={variant === 'wordmark' || variant === 'inline' || variant === 'stack' ? 'NIORA' : ''}
          className="logo__wordmark"
        />
      )}
    </span>
  );
};

export default Logo;
