import { useEffect, useState } from "react";

/**
 * Given a Pokémon species name, fetch its evolution chain from PokeAPI
 * and return only the immediate next evolution(s).
 *
 * Example: "squirtle" → ["wartortle"]
 *          "wartortle" → ["blastoise"]
 *          "blastoise" → []
 */
export function useEvolutionChain(speciesName: string | null) {
  const [evolutions, setEvolutions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!speciesName) {
      setEvolutions([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    // Normalize: lowercase + trim + replace spaces with hyphens
    // PokeAPI uses kebab-case for multi-word names (e.g. "mr-mime", "nidoran-f")
    const name = speciesName
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    console.debug(`[useEvolutionChain] 🔍 Fetching evolution chain for "${speciesName}" → normalized "${name}"`);

    async function fetchChain() {
      try {
        // 1. Get species data to find evolution_chain URL
        const speciesUrl = `https://pokeapi.co/api/v2/pokemon-species/${name}`;
        console.debug(`[useEvolutionChain] 📡 Fetching species: ${speciesUrl}`);
        const speciesRes = await fetch(speciesUrl);
        if (!speciesRes.ok) {
          console.warn(`[useEvolutionChain] ❌ Species fetch failed: ${speciesRes.status} ${speciesRes.statusText} for "${name}"`);
          setEvolutions([]);
          return;
        }
        const speciesData = await speciesRes.json();
        const chainUrl = speciesData.evolution_chain?.url;
        if (!chainUrl) {
          console.warn(`[useEvolutionChain] ❌ No evolution_chain URL in species data for "${name}"`);
          setEvolutions([]);
          return;
        }

        console.debug(`[useEvolutionChain] 📡 Fetching chain: ${chainUrl}`);
        // 2. Get the evolution chain
        const chainRes = await fetch(chainUrl);
        if (!chainRes.ok) {
          console.warn(`[useEvolutionChain] ❌ Chain fetch failed: ${chainRes.status}`);
          setEvolutions([]);
          return;
        }
        const chainData = await chainRes.json();

        // 3. Walk the chain to find the current species and its evolves_to
        const result: string[] = [];

        const walkChain = (chain: any): boolean => {
          const chainSpeciesName = chain.species?.name?.toLowerCase().trim();
          if (chainSpeciesName === name) {
            // Found it — collect its immediate evolutions
            for (const evo of chain.evolves_to || []) {
              if (evo.species?.name) {
                result.push(evo.species.name);
              }
            }
            console.debug(`[useEvolutionChain] ✅ Found "${name}" in chain. Evolutions:`, result);
            return true; // stop searching
          }
          for (const evo of chain.evolves_to || []) {
            if (walkChain(evo)) return true;
          }
          return false;
        };

        const found = walkChain(chainData.chain);
        if (!found) {
          console.warn(`[useEvolutionChain] ⚠️ "${name}" not found in evolution chain tree`);
        }

        if (!cancelled) {
          setEvolutions(result);
        }
      } catch (err) {
        console.error(`[useEvolutionChain] 💥 Exception for "${name}":`, err);
        if (!cancelled) setEvolutions([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchChain();

    return () => {
      cancelled = true;
    };
  }, [speciesName]);

  return { evolutions, loading };
}
