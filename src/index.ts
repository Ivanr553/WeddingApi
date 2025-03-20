export interface Env {
	API_HOST: string;
	ApiKey: string;
	BinId: string
}

type Body = RSVP;

interface IBin {
	record: {
		RSVP: RSVP[];
	};
}

interface RSVP {
	name: string;
	partner: string;
	email: string;
	attending: boolean;
	children: number;
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		try {
			const body: Body = await request.json();

			const newRsvp: RSVP = {
				...body
			};

			const BIN_ID = env.BinId;
			const API_KEY = env.ApiKey;
			const URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

			const getBinRequest = await fetch(URL, {
				method: 'GET',
				headers: {
					'X-Access-Key': API_KEY
				}
			});
			const bin = await getBinRequest.json() as IBin;

			for (let i = 0; i < bin.record.RSVP.length; i++) {
				const rsvp = bin.record.RSVP[i];
				if (rsvp.name === newRsvp.name) {
					return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
				}
			}

			bin.record.RSVP.push(newRsvp)

			const updateRequest = await fetch(URL, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-Access-Key': API_KEY
				},
				body: JSON.stringify(bin.record)
			});

			const response = await updateRequest.json();
		} catch (e) {
			return new Response(JSON.stringify(e), {
				"status": 500
			});
		}

		return new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
	},
} satisfies ExportedHandler<Env>;
