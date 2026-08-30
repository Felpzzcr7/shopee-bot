import { Telegraf } from 'telegraf';
import crypto from 'crypto';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

// Função para "desencurtar" links do app (s.shopee.com.br, shope.ee, shp.ee)
async function expandirUrl(urlCurta: string): Promise<string> {
    try {
        const response = await fetch(urlCurta, {
            method: 'GET',
            redirect: 'follow',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });
        return response.url || urlCurta;
    } catch (error) {
        console.error("Erro ao expandir URL:", error);
        return urlCurta;
    }
}

async function gerarLinkAfiliadoShopee(originUrl: string): Promise<string> {
    const appId = process.env.SHOPEE_APP_ID?.trim();
    const appSecret = process.env.SHOPEE_APP_SECRET?.trim();

    if (!appId || !appSecret) {
        console.error("ERRO: SHOPEE_APP_ID ou SHOPEE_APP_SECRET não foram configurados na Vercel.");
        return "Erro de configuração no servidor.";
    }

    let urlFinal = originUrl;
    if (originUrl.includes('shp.ee') || originUrl.includes('shope.ee') || originUrl.includes('s.shopee.com')) {
        urlFinal = await expandirUrl(originUrl);
    }

    const timestamp = Math.floor(Date.now() / 1000);

    const payload = JSON.stringify({
        query: `mutation { generateShortLink(input: { originUrl: "${urlFinal}" }) { shortLink } }`
    });

    const baseString = appId + timestamp + payload + appSecret;
    const signature = crypto
        .createHash('sha256')
        .update(baseString)
        .digest('hex');

    try {
        const response = await fetch('https://open-api.affiliate.shopee.com.br/graphql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${appId}, Timestamp=${timestamp}, Signature=${signature}`
            },
            body: payload
        });

        const result = await response.json();

        if (result?.data?.generateShortLink?.shortLink) {
            return result.data.generateShortLink.shortLink;
        }

        console.error("Resposta de erro da Shopee:", JSON.stringify(result));
        return "Não foi possível converter este link. Verifique se é uma URL válida da Shopee.";

    } catch (error) {
        console.error("Erro ao chamar a API da Shopee:", error);
        return "Tivemos um problema de conexão com o servidor da Shopee.";
    }
}

// Escuta MENSAGENS DE TEXTO e MENSAGENS COM FOTO/LEGENDA (compartilhamento do app)
bot.on(['text', 'photo'], async (ctx) => {
    const msg = ctx.message as any;
    
    // Captura o texto tanto se for mensagem normal quanto se for legenda de foto
    const texto = msg?.text || msg?.caption || '';

    const dominiosShopee = ['shopee.com', 'shp.ee', 'shope.ee', 's.shopee.com'];
    const temLinkShopee = dominiosShopee.some(dominio => texto.includes(dominio));

    if (temLinkShopee) {
        const regexUrl = /https?:\/\/[^\s]+/;
        const match = texto.match(regexUrl);
        const urlOriginal = match ? match[0] : texto;

        await ctx.reply('⏳ Processando link compartilhado...');

        const linkAfiliado = await gerarLinkAfiliadoShopee(urlOriginal);

        await ctx.reply(`🛒 *Aqui está o seu link de afiliado:*\n\n${linkAfiliado}`, {
            parse_mode: 'Markdown'
        });
    } else {
        await ctx.reply('Por favor, me envie um link válido da Shopee para converter!');
    }
});

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        await bot.handleUpdate(req.body);
    }
    res.status(200).send('OK');
}