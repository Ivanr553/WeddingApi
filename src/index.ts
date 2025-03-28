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
	dietary: string;
}

const corsHeaders = {
	"Access-Control-Allow-Origin": "https://www.jennaivan.wedding",
	"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
	"Access-Control-Max-Age": "86400",
};

export default {
	//@ts-ignore
	async handleOptions(request: Request): Promise<Response> {
		if (
			request.headers.get("Origin") !== null &&
			request.headers.get("Access-Control-Request-Method") !== null &&
			request.headers.get("Access-Control-Request-Headers") !== null
		) {
			// Handle CORS preflight requests.
			return new Response(null, {
				headers: {
					...corsHeaders,
					"Access-Control-Allow-Headers": request.headers.get(
						"Access-Control-Request-Headers",
					) ?? '*',
				},
			});
		} else {
			// Handle standard OPTIONS request.
			return new Response(null, {
				headers: {
					Allow: "GET, HEAD, POST, OPTIONS",
				},
			});
		}
	},
	async fetch(request, env, ctx): Promise<Response> {


		if (
			request.headers.get("Origin") !== null &&
			request.headers.get("Access-Control-Request-Method") !== null &&
			request.headers.get("Access-Control-Request-Headers") !== null
		) {
			// Handle CORS preflight requests.
			return new Response(null, {
				headers: {
					...corsHeaders,
					"Access-Control-Allow-Headers": request.headers.get(
						"Access-Control-Request-Headers",
					) ?? '*',
				},
			});
		}

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

			await fetch(URL, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'X-Access-Key': API_KEY
				},
				body: JSON.stringify(bin.record)
			});

		} catch (e) {
			return new Response(JSON.stringify(e), {
				"status": 500
			});
		}

		const response = new Response(JSON.stringify({ message: 'Success' }), { status: 200 });
		response.headers.set('Access-Control-Allow-Origin', '*');

		return response;
	},
} satisfies ExportedHandler<Env>;
