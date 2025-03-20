export interface Env {
	API_HOST: string;
	ApiKey: string;
	BinId: string
}

interface IBin {
	RSVP: Guest[];
}

interface Guest {
	name: string;
	partner: string;
	email: string;
	attending: boolean;
	children: number;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {

		const testData: Guest = {
			name: "test person 1",
			partner: "test person 2",
			email: "test@gmail.com",
			attending: true,
			children: 0
		};

		const BIN_ID = env.BinId;
		const API_KEY = env.ApiKey;
		const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

		const getBinRequest = await fetch(URL);
		const bin = await getBinRequest.json() as IBin;

		bin.RSVP.push(testData)

		const updateRequest = await fetch(URL, {
			method: 'PUT',
			headers: {
				'Content-Type': 'appplication/json',
				'X-Access-Key': API_KEY
			},
			body: JSON.stringify(bin)
		});

		console.log(await updateRequest.json())

		return new Response("Finished");
	},
} satisfies ExportedHandler<Env>;
