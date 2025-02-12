const API_URL = "https://economia.awesomeapi.com.br/json/available";

export async function fetchCurrencies(): Promise<string[]> {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Erro ao buscar moedas");
        }

        const data: Record<string, string> = await response.json();

        return Array.from(new Set(Object.values(data).map(name => name.split("/")[0])));
    } catch (error) {
        console.error("🚀 ~ fetchCurrencies ~ error:", error);
        return [];
    }
}