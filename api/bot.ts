import { Telegraf } from 'telegraf';

const bot = new Telegraf(process.env.TELEGRAM_TOKEN as string);

bot.on('text', async (ctx) => {
    const texto = ctx.message.text;
    
    if (texto.includes('shopee.com') || texto.includes('shp.ee')) {
        
        // Aqui entrará a função que chama a API da Shopee no futuro
        // const linkConvertido = await converterLink(texto);
        
        await ctx.reply('Link reconhecido! Em breve devolverei o link de afiliado.');
    } else {
        await ctx.reply('Por favor, me envie um link válido da Shopee.');
    }
});

export default async function handler(req: any, res: any) {
    if (req.method === 'POST') {
        await bot.handleUpdate(req.body);
    }
    res.status(200).send('OK');
}