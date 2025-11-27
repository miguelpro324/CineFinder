interface IconProps {
  svg: string;
  className?: string;
  style?: React.CSSProperties;
  size?: number | string;
}

function Icon({ svg, className = '', style = {}, size = '1.5rem' }: IconProps) {
  const defaultStyle: React.CSSProperties = {
    width: size,
    height: size,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    verticalAlign: 'middle',
    ...style
  };

  // Add size styling directly to the SVG
  const styledSvg = svg.replace(
    '<svg',
    `<svg style="width: 100%; height: 100%; display: block;"`
  );

  return (
    <span 
      className={className}
      style={defaultStyle}
      dangerouslySetInnerHTML={{ __html: styledSvg }}
    />
  );
}

export default Icon;
