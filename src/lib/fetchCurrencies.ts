const API_URL = "https://economia.awesomeapi.com.br/json/available";

export async function fetchCurrencies(): Promise<{ name: string; acronym: string }[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erro ao buscar moedas");
        }

        const data: Record<string, string> = await response.json();

        // Criando um Set para evitar duplicatas
        const currencies = new Map<string, string>();

        Object.entries(data).forEach(([acronymPair, namePair]) => {
            const [acronym] = acronymPair.split("-"); // Pegamos só o código da moeda (ex: "USD" de "USD-BRL")
            const name = namePair.split("/")[0]; // Pegamos apenas o nome da moeda

            if (!currencies.has(acronym)) {
                currencies.set(acronym, name);
            }
        });

        // Converte o Map para um array de objetos
        return Array.from(currencies, ([acronym, name]) => ({ name, acronym }));
    } catch (error) {
        console.error("🚀 ~ fetchCurrencies ~ error:", error);
        return [];
    }
}