import { posterUrl } from "../services/tmdb";

// Mostra os serviços de streaming recebidos via props (já filtrados pelo Brasil).
function ProviderList({ providers }) {
  if (!providers || providers.length === 0) {
    return <p className="provider-list__empty">Não encontramos onde assistir esse título.</p>;
  }

  return (
    <ul className="provider-list">
      {providers.map((provider) => (
        <li key={provider.provider_id}>
          <img src={posterUrl(provider.logo_path, "w45")} alt={provider.provider_name} />
          <span>{provider.provider_name}</span>
        </li>
      ))}
    </ul>
  );
}

export default ProviderList;
