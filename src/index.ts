export interface Env {
	API_HOST: string;
	ApiKey: string;
	SheetId: string
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const SHEET_ID = env.SheetId;
		const API_KEY = env.ApiKey;
		const RANGE = "Sheet1!A1:D1";
		const URL = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;

		const data = {
			values: [["New Value 1", "New Value 2", "New Value 3", "New Value 4"]]
		};

		const response = await fetch(URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify(data)
		});

		return new Response(await response.text(), {
			headers: { "content-type": "application/json" }
		});
	},
} satisfies ExportedHandler<Env>;
