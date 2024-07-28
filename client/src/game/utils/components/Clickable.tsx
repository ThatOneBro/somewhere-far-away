interface ClickableProps {
  children: JSX.Element;
}

const Clickable = ({ children }: ClickableProps) => {
  return (
    <group
      onPointerOver={() => {
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
      }}
    >
      {children}
    </group>
  );
};

export default Clickable;
