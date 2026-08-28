import { Telegraf } from 'telegraf';
import crypto from 'crypto';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

// Função para fazer o handshake criptografado e pedir o link de afiliado
async function gerarLinkAfiliadoShopee(originUrl: string): Promise<string> {
    const appId = process.env.SHOPEE_APP_ID;
    const appSecret = process.env.SHOPEE_APP_SECRET;

    if (!appId || !appSecret) {
        console.error("ERRO: SHOPEE_APP_ID ou SHOPEE_APP_SECRET não foram configurados na Vercel.");
        return "Erro de configuração no servidor.";
    }

    const timestamp = Math.floor(Date.now() / 1000);

    // Payload da query GraphQL oficial da Shopee
    const payload = JSON.stringify({
        query: `mutation {
            generateShortLink(input: { originUrl: "${originUrl}" }) {
                shortLink
            }
        }`
    });

    // Criptografia HMAC-SHA256 necessária para autenticação na Shopee
    const baseString = appId + timestamp + payload + appSecret;
    const signature = crypto
        .createHmac('sha256', appSecret)
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

// Escutador de mensagens no Telegram
bot.on('text', async (ctx) => {
    const texto = ctx.message.text;

    // Identifica se a mensagem contém um link da Shopee
    if (texto.includes('shopee.com') || texto.includes('shp.ee')) {
        // Isola apenas o link caso venha acompanhado de outros textos
        const regexUrl = /https?:\/\/[^\s]+/;
        const match = texto.match(regexUrl);
        const urlOriginal = match ? match[0] : texto;

        await ctx.reply('⏳ Convertendo seu link...');
        
        const linkAfiliado = await gerarLinkAfiliadoShopee(urlOriginal);
        
        await ctx.reply(`🛒 *Aqui está o seu link de afiliado:*\n\n${linkAfiliado}`, {
            parse_mode: 'Markdown'
        });
    } else {
        await ctx.reply('Por favor, me envie um link válido da Shopee para que eu possa converter!');
    }
});

// Handler do Webhook na Vercel
export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        await bot.handleUpdate(req.body);
    }
    res.status(200).send('OK');
}