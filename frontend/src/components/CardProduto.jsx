export default function CardProduto({ produto, adicionarAoCarrinho }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem", margin: "0.5rem" }}>
      <h3>{produto.nome}</h3>
      <p>Preço: R${produto.preco}</p>
      <button onClick={() => adicionarAoCarrinho(produto)}>Adicionar ao Carrinho</button>
    </div>
  );
}

