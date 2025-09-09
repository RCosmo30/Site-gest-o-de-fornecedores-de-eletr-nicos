export default function Botao({ onClick, children }) {
  return (
    <button onClick={onClick} style={{ padding: "0.5rem 1rem", marginTop: "0.5rem" }}>
      {children}
    </button>
  );
}

