import RedisClient from 'ioredis';
import { Redis } from '@spectacles/brokers';
import { Client as Proxy } from '@spectacles/proxy';

const redis = new RedisClient(6379, process.env.REDIS_URL);
const gateway = new Redis('gateway', redis);
const proxy = new Proxy(new Redis('proxy', redis), process.env.DISCORD_TOKEN);

gateway.on('MESSAGE_CREATE', async (body) => {
	const message = JSON.parse(body);
	console.log(message);
	if (message.content === 'ping') {
		const response = await proxy.post(`/channels/${message.channel_id}/messages`, {
			content: 'pong',
		});

		console.log(response);
	}
});

gateway.subscribe(['MESSAGE_CREATE']);
