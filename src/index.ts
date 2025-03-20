import weddingList from './wedding_list.json'


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

		(weddingList.list as Guest[]).push(testData);


		return new Response();
	},
} satisfies ExportedHandler<Env>;
